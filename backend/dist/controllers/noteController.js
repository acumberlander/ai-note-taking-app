"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNotesController = exports.deleteNotesController = exports.deleteNoteByIdController = exports.semanticQueryController = exports.searchNotesController = exports.getNoteByIdController = exports.getNotesController = exports.updateNoteController = exports.createNoteController = void 0;
exports.createNoteFromBackend = createNoteFromBackend;
const noteModel_1 = require("../models/noteModel");
const aiService_1 = require("../services/aiService");
const noteService_1 = require("../services/noteService");
/**
 * Note controller that saves a note to the postgres database
 * @param req
 * @param res
 */
const createNoteController = async (req, res) => {
    const { title, content, user_id } = req.body;
    if (!content) {
        res.status(400).json({ error: "Content is required" });
        return;
    }
    try {
        // Proceed directly with note creation
        const savedNote = await (0, noteService_1.createNote)(content, user_id, title);
        res.json({
            note: savedNote,
            message: "Note created successfully.",
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error creating note" });
    }
};
exports.createNoteController = createNoteController;
/**
 * Note controller that updates a note in the database.
 * @param req
 * @param res
 */
const updateNoteController = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    if (!id || isNaN(Number(id))) {
        res.status(400).json({ error: "Invalid note ID" });
        return;
    }
    if (!title || !content) {
        res.status(400).json({ error: "Title and content are required" });
        return;
    }
    try {
        const existingNote = await noteModel_1.Note.findById(Number(id));
        if (!existingNote) {
            res.status(404).json({ error: "Note not found" });
            return;
        }
        const updatedNote = await noteModel_1.Note.updateNoteById(Number(id), title, content);
        if (!updatedNote) {
            res.status(404).json({ error: "Note not found" });
            return;
        }
        res.status(200).json(updatedNote);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error updating note" });
    }
};
exports.updateNoteController = updateNoteController;
/**
 * Note controller that fetches all the notes from the postgres database
 * @param req
 * @param res
 */
const getNotesController = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 36;
        const id = req.params.id;
        if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
            res.status(400).json({ error: "Invalid pagination parameters" });
            return;
        }
        const notes = await noteModel_1.Note.findPaginated(page, limit, id);
        res.json(notes);
    }
    catch (err) {
        res.status(500).json({ error: "Error fetching notes", err });
    }
};
exports.getNotesController = getNotesController;
/**
 * Note controller that fetches a note from the postgres database based on the id passed in.
 * @param req
 * @param res
 */
const getNoteByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const note = await noteModel_1.Note.findById(parseInt(id));
        if (!note) {
            res.status(404).json({ error: "Note not found or not authorized" });
            return;
        }
        res.json(note);
    }
    catch (err) {
        res.status(500).json({ error: "Error fetching note by id", err });
    }
};
exports.getNoteByIdController = getNoteByIdController;
/**
 * Note controller that fetches all the notes from the postgres database that match
 * the keywords of the query in the request body.
 * @param req
 * @param res
 */
// Exact keyword search (used for typed search box)
const searchNotesController = async (req, res) => {
    const { query } = req.query;
    const user_id = req.query.user_id;
    if (!query || typeof query !== "string") {
        console.log("Invalid query - returning all notes");
        const allNotes = await noteModel_1.Note.findPaginated(1, 20, user_id);
        res.json(allNotes);
        return;
    }
    const notes = await noteModel_1.Note.searchByKeyword(query, user_id);
    res.json(notes);
};
exports.searchNotesController = searchNotesController;
/**
 * Note controller that determines what crud actions to take based on the query that's passed in.
 * @param req
 * @param res
 */
const semanticQueryController = async (req, res) => {
    try {
        const { query, user_id, sensitivity = 0.22 } = req.body;
        let notes = [];
        let editedNotes = [];
        let content;
        if (!query || typeof query !== "string" || query.trim() === "") {
            notes = await noteModel_1.Note.findPaginated(1, 20, user_id);
            res.json({
                notes,
                editedNotes: [],
                message: "I didn't hear anything, so I returned all your notes.",
                intent: "show_all",
            });
            return;
        }
        // Get intent classification
        const intent = await (0, aiService_1.classifyIntent)(query);
        console.log("Intent classification:", intent);
        // Handle different intents
        if (intent === "show_all") {
            notes = await noteModel_1.Note.findPaginated(1, 20, user_id);
        }
        else if (intent === "create_note") {
            // Generate content for the potential note
            content = await (0, aiService_1.generateContent)(query);
            const title = await (0, aiService_1.generateTitle)(content);
            // Create note immediately without similarity check
            const newNote = await (0, noteService_1.createNote)(content, user_id, title);
            // Make sure we're returning the newly created note
            res.json({
                notes: [newNote],
                content,
                similarNotes: [],
                editedNotes: [],
                intent,
                message: "I've created your note about " + title,
            });
            return;
        }
        else if (intent === "request") {
            const newContent = await (0, aiService_1.generateContent)(query);
            const newNote = await (0, noteService_1.createNote)(newContent, user_id);
            // Just use the returned note directly - don't fetch it again
            if (newNote && newNote.id) {
                notes = [newNote];
            }
        }
        else if (intent === "delete_all") {
            // Get all user's notes for deletion
            notes = await noteModel_1.Note.findPaginated(1, 20, user_id);
        }
        else if (intent === "delete_notes" ||
            intent === "search" ||
            intent === "edit_notes") {
            // For deletion or editing, strip out command words to focus on relevant keywords
            const searchQuery = intent === "delete_notes" || intent === "edit_notes"
                ? await (0, aiService_1.trimCommand)(query)
                : query;
            notes = await noteModel_1.Note.searchByEmbedding(searchQuery, user_id, parseFloat(sensitivity));
            // If no notes found for search/delete/edit, generate a "not found" message
            if (notes.length === 0) {
                const summaryMessage = await (0, aiService_1.generateQueryResponse)(query, intent, []);
                res.json({
                    notes: [],
                    editedNotes: [],
                    intent,
                    message: summaryMessage,
                });
                return;
            }
            if (intent === "edit_notes") {
                editedNotes = await (0, aiService_1.semanticEditNotes)(query, notes);
                if (editedNotes.length > 0) {
                    // Filter notes to only include those that were edited
                    const editedIds = editedNotes.map((note) => note.id);
                    notes = notes.filter((note) => editedIds.includes(note.id));
                    console.log("Edited notes:", editedNotes);
                }
                else {
                    console.log("No notes were edited");
                }
            }
        }
        const summaryMessage = await (0, aiService_1.generateQueryResponse)(query, intent, notes);
        res.json({
            notes,
            editedNotes,
            intent,
            message: summaryMessage,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error performing semantic search" });
    }
};
exports.semanticQueryController = semanticQueryController;
/**
 *
 * @param content
 * @returns
 */
async function createNoteFromBackend(content, user_id) {
    let title = await (0, aiService_1.generateTitle)(content);
    // Fallback if title generation fails
    if (!title || title.trim() === "") {
        title = content.split(" ").slice(0, 7).join(" ") + "...";
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
/**
 * Note controller that deletes a note from the postgres database based on the id
 * in the request parameter.
 * @param req
 * @param res
 */
const deleteNoteByIdController = async (req, res) => {
    const { id } = req.params;
    const user_id = req.query.user_id || req.body.user_id;
    if (!id || isNaN(Number(id))) {
        res.status(400).json({ error: "Invalid note ID" });
        return;
    }
    try {
        const existingNote = await noteModel_1.Note.findById(Number(id));
        if (!existingNote) {
            res.status(404).json({ error: "Note not found" });
            return;
        }
        const deleted = await noteModel_1.Note.deleteNoteById(Number(id));
        if (deleted) {
            res.status(200).json({ message: "Note deleted successfully" });
        }
        else {
            res.status(404).json({ error: "Note not found" });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error deleting note" });
    }
};
exports.deleteNoteByIdController = deleteNoteByIdController;
/**
 * Note controller that deletes an array of note IDs passed as a query parameter.
 * @param req
 * @param res
 */
const deleteNotesController = async (req, res) => {
    const { noteIds, user_id } = req.body;
    if (!Array.isArray(noteIds) || noteIds.length === 0) {
        res.json({ message: "No notes to delete" });
        return;
    }
    if (user_id) {
        for (const id of noteIds) {
            const note = await noteModel_1.Note.findById(id);
            if (!note) {
                res.status(403).json({
                    error: "You do not have permission to delete one or more of these notes",
                });
                return;
            }
        }
    }
    try {
        const deletedCount = await noteModel_1.Note.deleteNotesByIds(noteIds);
        if (deletedCount && deletedCount > 0) {
            res
                .status(200)
                .json({ message: `${deletedCount} note(s) deleted successfully` });
        }
        else {
            res.status(404).json({ error: "No notes found for deletion" });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error deleting notes" });
    }
};
exports.deleteNotesController = deleteNotesController;
/**
 * Updates multiple notes in a single request.
 * @param req Request containing array of notes to update
 * @param res Response with updated notes
 */
const updateNotesController = async (req, res) => {
    const { notes, user_id } = req.body;
    if (!Array.isArray(notes) || notes.length === 0) {
        res.status(400).json({ error: "Notes array must not be empty" });
        return;
    }
    // Validate notes have required fields
    const validNotes = notes.filter((note) => note.id && note.title && note.content);
    if (validNotes.length === 0) {
        res.status(400).json({ error: "No valid notes to update" });
        return;
    }
    try {
        // Convert to Note objects
        const noteObjects = validNotes.map((note) => new noteModel_1.Note(note.title, note.content, user_id, note.id));
        // Use batch update
        const updatedNotes = await noteModel_1.Note.batchUpdateNotes(noteObjects);
        if (updatedNotes.length > 0) {
            res.status(200).json({
                notes: updatedNotes,
                message: `${updatedNotes.length} note(s) updated successfully`,
            });
        }
        else {
            res.status(404).json({ error: "No notes were updated" });
        }
    }
    catch (err) {
        console.error("Error updating multiple notes:", err);
        res.status(500).json({ error: "Error updating notes" });
    }
};
exports.updateNotesController = updateNotesController;
