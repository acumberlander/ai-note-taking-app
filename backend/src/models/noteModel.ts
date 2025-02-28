import { pool } from "../db";

export class Note {
  id?: number;
  title: string;
  content: string;

  constructor(title: string, content: string, id?: number) {
    this.id = id;
    this.title = title;
    this.content = content;
  }

  /**
   * Note class method that saves a note to the postgres database
   * @returns
   */
  async save(): Promise<Note> {
    const result = await pool.query(
      `INSERT INTO notes (title, content) 
       VALUES ($1, $2) 
       RETURNING *`,
      [this.title, this.content]
    );
    return new Note(
      result.rows[0].title,
      result.rows[0].content,
      result.rows[0].id
    );
  }

  /**
   * Note class method that fetch all notes with pagination
   * @param page
   * @param limit
   * @returns an array of notes
   */
  static async findPaginated(page: number, limit: number): Promise<Note[]> {
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT * FROM notes 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return result.rows.map((row) => new Note(row.title, row.content, row.id));
  }

  /**
   * Note class method that finds notes based off keyword search.
   * @param queryKey
   * @returns
   */
  static async searchByKeyword(queryKey: string): Promise<Note[]> {
    queryKey = queryKey.toLowerCase();
    const result = await pool.query(
      `SELECT * FROM notes 
       WHERE position($1 in LOWER(title) )>0 OR position( $1 in LOWER(content) )>0`,
      [queryKey]
    );

    if (result.rows.length > 0) {
      console.log("keyword FOUND");
    } else {
      console.log("keyword not found in notes");
    }

    return result.rows.map((row) => new Note(row.title, row.content, row.id));
  }

  /**
   * Note class method that finds a note by the id.
   * @param id
   * @returns
   */
  static async findById(id: number): Promise<Note | null> {
    const result = await pool.query("SELECT * FROM notes WHERE id = $1", [id]);

    if (result.rows.length === 0) return null;

    return new Note(
      result.rows[0].title,
      result.rows[0].content,
      result.rows[0].id
    );
  }

  /**
   * Note class method that updates a note based on the id.
   * @param id - The ID of the note to update.
   * @param title - The new title of the note.
   * @param content - The new content of the note.
   * @returns The updated note or null if not found.
   */
  static async updateNoteById(
    id: number,
    title: string,
    content: string
  ): Promise<Note | null> {
    const result = await pool.query(
      `UPDATE notes 
       SET title = $1, content = $2 
       WHERE id = $3 
       RETURNING id, title, content`,
      [title, content, id]
    );

    if (result.rows.length === 0) return null;

    return new Note(
      result.rows[0].title,
      result.rows[0].content,
      result.rows[0].id
    );
  }

  /**
   * Note class method that deletes note based on the id.
   * @param id
   * @returns
   */
  static async deleteNoteById(id: number): Promise<boolean> {
    const result = await pool.query("DELETE FROM notes WHERE id = $1", [id]);

    return (result.rowCount ?? 0) > 0;
  }
}
