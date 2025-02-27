import express from "express";
import {
  createNote,
  getNotes,
  getNoteById,
  searchNotes,
  deleteNoteById,
} from "../controllers/noteController";

const router = express.Router();

router.post("/", createNote);
router.get("/", getNotes);
router.get("/search", searchNotes);
router.get("/:id", getNoteById);
router.delete("/:id", deleteNoteById);

export { router as noteRoutes };
