import { pool } from "../db";

export class Note {
  id?: number;
  title: string;
  content: string;
  embedding: number[];

  constructor(
    title: string,
    content: string,
    embedding: number[],
    id?: number
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.embedding = embedding;
  }

  // Save a new note
  async save(): Promise<Note> {
    const result = await pool.query(
      `INSERT INTO notes (title, content, embedding) 
       VALUES ($1, $2, $3) 
       RETURNING id, title, content, embedding`,
      [this.title, this.content, this.embedding]
    );

    return new Note(
      result.rows[0].title,
      result.rows[0].content,
      result.rows[0].embedding,
      result.rows[0].id
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
      (row) => new Note(row.title, row.content, row.embedding, row.id)
    );
  }

  // AI-powered search by embeddings
  static async searchByEmbedding(queryEmbedding: number[]): Promise<Note[]> {
    const result = await pool.query(
      `SELECT * FROM notes 
       ORDER BY embedding <-> $1 
       LIMIT 5`,
      [queryEmbedding]
    );

    return result.rows.map(
      (row) => new Note(row.title, row.content, row.embedding, row.id)
    );
  }

  // Find a note by ID
  static async findById(id: number): Promise<Note | null> {
    const result = await pool.query("SELECT * FROM notes WHERE id = $1", [id]);

    if (result.rows.length === 0) return null;

    return new Note(
      result.rows[0].title,
      result.rows[0].content,
      result.rows[0].embedding,
      result.rows[0].id
    );
  }
}
