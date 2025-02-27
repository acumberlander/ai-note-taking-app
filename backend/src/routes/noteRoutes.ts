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
router.get("/:id", getNoteById);
router.delete("/:id", deleteNoteById);
router.get("/search", searchNotes);

export { router as noteRoutes };
