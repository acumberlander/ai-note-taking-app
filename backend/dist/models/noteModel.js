"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Note = void 0;
const db_1 = require("../db");
const openai_1 = require("openai");
const aiService_1 = require("../services/aiService");
const openai = new openai_1.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
class Note {
    constructor(title, content, user_id, id, embedding, similarity) {
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
    async save() {
        const noteText = `${this.title} ${this.content}`;
        const embedding = await (0, aiService_1.generateEmbedding)(noteText);
        const formattedEmbedding = JSON.stringify(embedding);
        const result = await db_1.pool.query(`
      INSERT INTO notes (title, content, embedding, "user_id")
      VALUES ($1, $2, $3::vector, $4)
      RETURNING *
      `, [this.title, this.content, formattedEmbedding, this.user_id]);
        return new Note(result.rows[0].title, result.rows[0].content, result.rows[0].user_id, result.rows[0].id, result.rows[0].embedding, result.rows[0].similarity);
    }
    /**
     * Exact keyword search (for regular search bar functionality).
     */
    static async searchByKeyword(query, user_id) {
        query = `%${query.toLowerCase()}%`;
        let sqlQuery = `
      SELECT * FROM notes 
      WHERE (LOWER(title) LIKE $1 OR LOWER(content) LIKE $1)`;
        const params = [query];
        if (user_id) {
            sqlQuery += ` AND "user_id" = $2`;
            params.push(user_id);
        }
        const result = await db_1.pool.query(sqlQuery, params);
        return result.rows.map((row) => new Note(row.title, row.content, row.user_id, row.id, row.embedding));
    }
    /**
     * Semantic search using OpenAI embeddings (for voice search functionality).
     * @param query The search query
     * @param user_id The user ID
     * @param sensitivity Optional sensitivity value (0.1-0.9, lower = more results)
     * @returns Array of matching notes
     */
    static async searchByEmbedding(query, user_id, sensitivity = 0.24) {
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
        const result = await db_1.pool.query(sqlQuery, params);
        return result.rows.map((row) => new Note(row.title, row.content, row.user_id, row.id, row.embedding, row.similarity));
    }
    /**
     * Fetch paginated list of notes.
     */
    static async findPaginated(page = 1, limit = 36, user_id) {
        const offset = (page - 1) * limit;
        let query = `SELECT * FROM notes`;
        const params = [];
        if (user_id) {
            query += ` WHERE "user_id" = $1`;
            params.push(user_id);
            query += ` LIMIT $2 OFFSET $3`;
            params.push(limit, offset);
        }
        else {
            query += ` LIMIT $1 OFFSET $2`;
            params.push(limit, offset);
        }
        const result = await db_1.pool.query(query, params);
        return result.rows.map((row) => new Note(row.title, row.content, row.user_id, row.id, row.embedding));
    }
    /**
     * Find note by ID.
     */
    static async findById(id, user_id) {
        let query = "SELECT * FROM notes WHERE id = $1";
        const params = [id];
        if (user_id) {
            query += ' AND "user_id" = $2';
            params.push(user_id);
        }
        const result = await db_1.pool.query(query, params);
        if (result.rows.length === 0)
            return null;
        return new Note(result.rows[0].title, result.rows[0].content, result.rows[0].user_id, result.rows[0].id, result.rows[0].embedding);
    }
    /**
     * Update note by ID, and regenerate embedding.
     */
    static async updateNoteById(id, title, content) {
        const noteText = `${title} ${content}`;
        const embedding = await (0, aiService_1.generateEmbedding)(noteText);
        const formattedEmbedding = `[${embedding.join(",")}]`;
        const result = await db_1.pool.query(`
      UPDATE notes 
      SET title = $1, content = $2, embedding = $3::vector
      WHERE id = $4
      RETURNING *
      `, [title, content, formattedEmbedding, id]);
        if (result.rows.length === 0)
            return null;
        return new Note(result.rows[0].title, result.rows[0].content, result.rows[0].user_id, result.rows[0].id, result.rows[0].embedding, result.rows[0].similarity);
    }
    /**
     * Update notes with new values and regenerate embedding.
     */
    static async updateNotes(notes) {
        const updatedNotes = [];
        for (const note of notes) {
            const noteText = `${note.title} ${note.content}`;
            const embedding = await (0, aiService_1.generateEmbedding)(noteText);
            const formattedEmbedding = JSON.stringify(embedding);
            const result = await db_1.pool.query(`
        UPDATE notes 
        SET title = $1, content = $2, embedding = $3::vector
        WHERE id = $4
        RETURNING *
        `, [note.title, note.content, formattedEmbedding, note.id]);
            if (result.rows.length === 0)
                return null;
            updatedNotes.push(new Note(result.rows[0].title, result.rows[0].content, result.rows[0].id, result.rows[0].embedding, result.rows[0].similarity));
        }
        return updatedNotes;
    }
    /**
     * Delete note by ID.
     */
    static async deleteNoteById(id) {
        const result = await db_1.pool.query("DELETE FROM notes WHERE id = $1", [id]);
        return (result.rowCount ?? 0) > 0;
    }
    /**
     * Delete multiple notes by their IDs.
     */
    static async deleteNotesByIds(ids) {
        if (ids.length === 0)
            return 0;
        const result = await db_1.pool.query("DELETE FROM notes WHERE id = ANY($1)", [
            ids,
        ]);
        return result.rowCount;
    }
    /**
     * Batch update multiple notes at once
     */
    static async batchUpdateNotes(notes) {
        if (notes.length === 0)
            return [];
        const updatedNotes = [];
        // Process notes in parallel using Promise.all
        await Promise.all(notes.map(async (note) => {
            if (!note.id)
                return; // Skip notes without ID
            const noteText = `${note.title} ${note.content}`;
            const embedding = await (0, aiService_1.generateEmbedding)(noteText);
            const formattedEmbedding = JSON.stringify(embedding);
            const result = await db_1.pool.query(`UPDATE notes 
           SET title = $1, content = $2, embedding = $3::vector
           WHERE id = $4
           RETURNING *`, [note.title, note.content, formattedEmbedding, note.id]);
            if (result.rows.length > 0) {
                updatedNotes.push(new Note(result.rows[0].title, result.rows[0].content, result.rows[0].user_id, result.rows[0].id, result.rows[0].embedding));
            }
        }));
        return updatedNotes;
    }
}
exports.Note = Note;
