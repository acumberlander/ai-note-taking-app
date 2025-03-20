"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNote = createNote;
const noteModel_1 = require("../models/noteModel");
const aiService_1 = require("./aiService");
/**
 * Creates a new note with the given content and user ID.
 * Generates a title if one is not provided.
 */
async function createNote(content, user_id, providedTitle) {
    if (!content) {
        throw new Error("Content is required");
    }
    let title = providedTitle;
    // Generate title if not provided
    if (!title) {
        title = await (0, aiService_1.generateTitle)(content);
        // Fallback if title generation fails
        if (!title || title.trim() === "") {
            title = content.split(" ").slice(0, 7).join(" ") + "...";
        }
    }
    try {
        const note = new noteModel_1.Note(title, content, user_id);
        const savedNote = await note.save();
        return savedNote;
    }
    catch (error) {
        console.error("Error creating note:", error);
        throw new Error("Failed to create note");
    }
}
