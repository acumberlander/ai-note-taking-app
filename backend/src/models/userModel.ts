import { pool } from "../db";
import { Note } from "./noteModel";

export class User {
  id: string;

  constructor(id: string) {
    this.id = id;
  }

  /**
   * Creates a new user in the postgres database
   * @param id
   */
  async save(id: string): Promise<User> {
    const result = await pool.query(
      `
      INSERT INTO users (id)
      VALUES ($1)
      RETURNING *
      `,
      [id]
    );

    return new User(result.rows[0].id);
  }

  /**
   * Fetch notes by user in the postgres database
   * @param id
   */
  static async fetchNotesByUserId(id: string): Promise<Note[]> {
    const result = await pool.query(
      `
      SELECT * FROM notes
      WHERE "user_id" = $1
      `,
      [id]
    );

    if (result.rows.length === 0) return [];

    return result.rows.map(
      (row) =>
        new Note(row.title, row.content, row.user_id, row.id, row.embedding)
    );
  }

  /**
   * Fetch user by id in the postgres database
   * @param id
   */
  static async fetchUserById(id: string): Promise<User | null> {
    const result = await pool.query(
      `
      SELECT * FROM users
      WHERE "id" = $1
      `,
      [id]
    );

    if (result.rows.length === 0) return null;

    return new User(result.rows[0].id);
  }
}
