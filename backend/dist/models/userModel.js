"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const db_1 = require("../db");
const noteModel_1 = require("./noteModel");
class User {
    constructor(id) {
        this.id = id;
    }
    /**
     * Creates a new user in the postgres database
     * @param id
     */
    async save(id) {
        const result = await db_1.pool.query(`
      INSERT INTO users (id)
      VALUES ($1)
      RETURNING *
      `, [id]);
        return new User(result.rows[0].id);
    }
    /**
     * Fetch notes by user in the postgres database
     * @param id
     */
    static async fetchNotesByUserId(id) {
        const result = await db_1.pool.query(`
      SELECT * FROM notes
      WHERE "user_id" = $1
      `, [id]);
        if (result.rows.length === 0)
            return [];
        return result.rows.map((row) => new noteModel_1.Note(row.title, row.content, row.user_id, row.id, row.embedding));
    }
    /**
     * Fetch user by id in the postgres database
     * @param id
     */
    static async fetchUserById(id) {
        const result = await db_1.pool.query(`
      SELECT * FROM users
      WHERE "id" = $1
      `, [id]);
        if (result.rows.length === 0)
            return null;
        return new User(result.rows[0].id);
    }
}
exports.User = User;
