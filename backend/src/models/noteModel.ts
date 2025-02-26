import { pool } from "../db";

export class Note {
  title: string;
  content: string;
  id?: number;

  constructor(
    title: string,
    content: string,
    id?: number
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
  }

  // Save a new note
  async save(): Promise<Note> {
    const result = await pool.query(
      `INSERT INTO notes (title, content) 
       VALUES ($1, $2) 
       RETURNING id, title, content`,
      [this.title, this.content]
    );
    console.log('saving in db');
    return new Note(
      result.rows[0].id,
      result.rows[0].title,
      result.rows[0].content
    );
  }

  // Fetch all notes with pagination
  static async findPaginated(page: number, limit: number): Promise<Note[]> {
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT * FROM notes 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return result.rows.map(
      (row) => new Note(row.id, row.title, row.content)
    );
  }

  // keyword search for now
  static async searchByKeyword(queryKey: string): Promise<Note[]> {
    queryKey = queryKey.toLowerCase();
    const result = await pool.query(
      `SELECT * FROM notes 
       WHERE position($1 in LOWER(title) )>0 OR position( $1 in LOWER(content) )>0`,
      [queryKey]
    );

    if(result.rows.length>0){
      console.log("keyword FOUND");
    }
    else{
      console.log("keyword not found in notes");
    }

    return result.rows.map(
      (row) => new Note(row.id, row.title, row.content)
    );
  }

  // Find a note by ID
  static async findById(id: number): Promise<Note | null> {
    const result = await pool.query("SELECT * FROM notes WHERE id = $1", [id]);

    if (result.rows.length === 0) return null;

    return new Note(
      result.rows[0].id,
      result.rows[0].title,
      result.rows[0].content
    );
  }
}


