import { pool } from "../db";
import { OpenAI } from "openai";
import { generateEmbedding } from "../services/aiService";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export class Note {
  id?: number;
  title: string;
  content: string;
  embedding?: number[];
  similarity?: number;

  constructor(
    title: string,
    content: string,
    id?: number,
    embedding?: number[],
    similarity?: number
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.embedding = embedding;
    this.similarity = similarity;
  }

  /**
   * Saves the note to the database, including its embedding.
   */
  async save(): Promise<Note> {
    const noteText = `${this.title} ${this.content}`;
    const embedding = await generateEmbedding(noteText);
    const formattedEmbedding = JSON.stringify(embedding);

    const result = await pool.query(
      `
      INSERT INTO notes (title, content, embedding)
      VALUES ($1, $2, $3::vector)
      RETURNING *
        `,
      [this.title, this.content, formattedEmbedding]
    );

    return new Note(
      result.rows[0].title,
      result.rows[0].content,
      result.rows[0].id,
      result.rows[0].embedding,
      result.rows[0].similarity
    );
  }

  /**
   * Exact keyword search (for regular search bar functionality).
   */
  static async searchByKeyword(query: string): Promise<Note[]> {
    query = `%${query.toLowerCase()}%`;

    const result = await pool.query(
      `SELECT * FROM notes 
         WHERE LOWER(title) LIKE $1 OR LOWER(content) LIKE $1`,
      [query]
    );

    console.log("Keyword search result count:", result.rows.length); // Debug log

    return result.rows.map(
      (row) => new Note(row.title, row.content, row.id, row.embedding)
    );
  }

  /**
   * Semantic search using OpenAI embeddings (for voice search functionality).
   */
  static async searchByEmbedding(query: string): Promise<Note[]> {
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: query,
    });

    const embedding = embeddingResponse.data[0].embedding;
    const formattedEmbedding = JSON.stringify(embedding);

    const result = await pool.query(
      `
      SELECT *, (embedding <=> $1::vector) AS similarity
      FROM notes
      WHERE (embedding <=> $1::vector) < $2
      ORDER BY similarity ASC
      LIMIT 10
      `,
      [formattedEmbedding, 0.25]
    );

    return result.rows.map(
      (row) =>
        new Note(row.title, row.content, row.id, row.embedding, row.similarity)
    );
  }

  /**
   * Fetch paginated list of notes.
   */
  static async findPaginated(page: number, limit: number): Promise<Note[]> {
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT * FROM notes 
             LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return result.rows.map(
      (row) => new Note(row.title, row.content, row.id, row.embedding)
    );
  }

  /**
   * Find note by ID.
   */
  static async findById(id: number): Promise<Note | null> {
    const result = await pool.query("SELECT * FROM notes WHERE id = $1", [id]);

    if (result.rows.length === 0) return null;

    return new Note(
      result.rows[0].title,
      result.rows[0].content,
      result.rows[0].id,
      result.rows[0].embedding
    );
  }

  /**
   * Update note by ID, and regenerate embedding.
   */
  static async updateNoteById(
    id: number,
    title: string,
    content: string
  ): Promise<Note | null> {
    const noteText = `${title} ${content}`;
    const embedding = await generateEmbedding(noteText);
    const formattedEmbedding = `[${embedding.join(",")}]`;

    const result = await pool.query(
      `UPDATE notes 
             SET title = $1, content = $2, embedding = $3::vector
             WHERE id = $4
             RETURNING *`,
      [title, content, formattedEmbedding, id]
    );

    if (result.rows.length === 0) return null;

    return new Note(
      result.rows[0].title,
      result.rows[0].content,
      result.rows[0].id,
      result.rows[0].embedding,
      result.rows[0].similarity
    );
  }

  /**
   * Delete note by ID.
   */
  static async deleteNoteById(id: number): Promise<boolean> {
    const result = await pool.query("DELETE FROM notes WHERE id = $1", [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
