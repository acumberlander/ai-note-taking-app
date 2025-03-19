import { pool } from "../db";
import { OpenAI } from "openai";
import { generateEmbedding } from "../services/aiService";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export class Note {
  id?: number;
  user_id: string | null;
  title: string;
  content: string;
  embedding?: number[];
  similarity?: number;

  constructor(
    title: string,
    content: string,
    user_id: string | null,
    id?: number,
    embedding?: number[],
    similarity?: number
  ) {
    this.id = id;
    this.user_id = user_id;
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
      INSERT INTO notes (title, content, embedding, "user_id")
      VALUES ($1, $2, $3::vector, $4)
      RETURNING *
      `,
      [this.title, this.content, formattedEmbedding, this.user_id]
    );

    return new Note(
      result.rows[0].title,
      result.rows[0].content,
      result.rows[0].user_id,
      result.rows[0].id,
      result.rows[0].embedding,
      result.rows[0].similarity
    );
  }

  /**
   * Exact keyword search (for regular search bar functionality).
   */
  static async searchByKeyword(
    query: string,
    user_id?: string
  ): Promise<Note[]> {
    query = `%${query.toLowerCase()}%`;
    let sqlQuery = `
      SELECT * FROM notes 
      WHERE (LOWER(title) LIKE $1 OR LOWER(content) LIKE $1)`;

    const params = [query];

    if (user_id) {
      sqlQuery += ` AND "user_id" = $2`;
      params.push(user_id);
    }

    const result = await pool.query(sqlQuery, params);

    return result.rows.map(
      (row) =>
        new Note(row.title, row.content, row.user_id, row.id, row.embedding)
    );
  }

  /**
   * Semantic search using OpenAI embeddings (for voice search functionality).
   * @param query The search query
   * @param user_id The user ID
   * @param sensitivity Optional sensitivity value (0.1-0.9, lower = more results)
   * @returns Array of matching notes
   */
  static async searchByEmbedding(
    query: string,
    user_id: string,
    sensitivity: number = 0.24
  ): Promise<Note[]> {
    // Validate sensitivity is within reasonable bounds
    sensitivity = Math.max(0.1, Math.min(0.9, sensitivity));

    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: query,
    });

    const embedding = embeddingResponse.data[0].embedding;
    const formattedEmbedding = JSON.stringify(embedding);

    let sqlQuery = `
      SELECT *, (embedding <=> $1::vector) AS similarity
      FROM notes
      WHERE (embedding <=> $1::vector) < $2 
      AND "user_id" = $3
      ORDER BY similarity ASC
      LIMIT 36
      `;
    const params = [formattedEmbedding, sensitivity, user_id];
    const result = await pool.query(sqlQuery, params);

    return result.rows.map(
      (row) =>
        new Note(
          row.title,
          row.content,
          row.user_id,
          row.id,
          row.embedding,
          row.similarity
        )
    );
  }

  /**
   * Fetch paginated list of notes.
   */
  static async findPaginated(
    page: number = 1,
    limit: number = 36,
    user_id?: string
  ): Promise<Note[]> {
    const offset = (page - 1) * limit;
    let query = `SELECT * FROM notes`;
    const params: (string | number)[] = [];

    if (user_id) {
      query += ` WHERE "user_id" = $1`;
      params.push(user_id);
      query += ` LIMIT $2 OFFSET $3`;
      params.push(limit, offset);
    } else {
      query += ` LIMIT $1 OFFSET $2`;
      params.push(limit, offset);
    }

    const result = await pool.query(query, params);

    return result.rows.map(
      (row) =>
        new Note(row.title, row.content, row.user_id, row.id, row.embedding)
    );
  }

  /**
   * Find note by ID.
   */
  static async findById(id: number, user_id?: string): Promise<Note | null> {
    let query = "SELECT * FROM notes WHERE id = $1";
    const params: (string | number)[] = [id];

    if (user_id) {
      query += ' AND "user_id" = $2';
      params.push(user_id);
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) return null;

    return new Note(
      result.rows[0].title,
      result.rows[0].content,
      result.rows[0].user_id,
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
      `
      UPDATE notes 
      SET title = $1, content = $2, embedding = $3::vector
      WHERE id = $4
      RETURNING *
      `,
      [title, content, formattedEmbedding, id]
    );

    if (result.rows.length === 0) return null;

    return new Note(
      result.rows[0].title,
      result.rows[0].content,
      result.rows[0].user_id,
      result.rows[0].id,
      result.rows[0].embedding,
      result.rows[0].similarity
    );
  }

  /**
   * Update notes with new values and regenerate embedding.
   */
  static async updateNotes(notes: Note[]): Promise<Note[] | null> {
    const updatedNotes: Note[] = [];

    for (const note of notes) {
      const noteText = `${note.title} ${note.content}`;
      const embedding = await generateEmbedding(noteText);
      const formattedEmbedding = JSON.stringify(embedding);

      const result = await pool.query(
        `
        UPDATE notes 
        SET title = $1, content = $2, embedding = $3::vector
        WHERE id = $4
        RETURNING *
        `,
        [note.title, note.content, formattedEmbedding, note.id]
      );

      if (result.rows.length === 0) return null;

      updatedNotes.push(
        new Note(
          result.rows[0].title,
          result.rows[0].content,
          result.rows[0].id,
          result.rows[0].embedding,
          result.rows[0].similarity
        )
      );
    }

    return updatedNotes;
  }

  /**
   * Delete note by ID.
   */
  static async deleteNoteById(id: number): Promise<boolean> {
    const result = await pool.query("DELETE FROM notes WHERE id = $1", [id]);
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Delete multiple notes by their IDs.
   */
  static async deleteNotesByIds(ids: number[]): Promise<number | null> {
    if (ids.length === 0) return 0;

    const result = await pool.query("DELETE FROM notes WHERE id = ANY($1)", [
      ids,
    ]);

    return result.rowCount;
  }

  /**
   * Batch update multiple notes at once
   */
  static async batchUpdateNotes(notes: Note[]): Promise<Note[]> {
    if (notes.length === 0) return [];

    const updatedNotes: Note[] = [];

    // Process notes in parallel using Promise.all
    await Promise.all(
      notes.map(async (note) => {
        if (!note.id) return; // Skip notes without ID

        const noteText = `${note.title} ${note.content}`;
        const embedding = await generateEmbedding(noteText);
        const formattedEmbedding = JSON.stringify(embedding);

        const result = await pool.query(
          `UPDATE notes 
           SET title = $1, content = $2, embedding = $3::vector
           WHERE id = $4
           RETURNING *`,
          [note.title, note.content, formattedEmbedding, note.id]
        );

        if (result.rows.length > 0) {
          updatedNotes.push(
            new Note(
              result.rows[0].title,
              result.rows[0].content,
              result.rows[0].user_id,
              result.rows[0].id,
              result.rows[0].embedding
            )
          );
        }
      })
    );

    return updatedNotes;
  }
}
