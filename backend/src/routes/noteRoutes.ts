import express from "express";
import {
  createNote,
  getNotes,
  getNoteById,
  searchNotes,
  semanticSearchNotes,
  deleteNoteById,
  updateNote,
} from "../controllers/noteController";

const router = express.Router();

router.post("/", createNote);
router.get("/", getNotes);
router.get("/search", searchNotes);
router.post("/semantic-search", semanticSearchNotes);
router.get("/:id", getNoteById);
router.delete("/:id", deleteNoteById);
router.put("/:id", updateNote);

export { router as noteRoutes };
