import express from "express";
import {
  createNote,
  getNotes,
  searchNotes,
} from "../controllers/noteController";

const router = express.Router();

router.post("/", createNote);
router.get("/", getNotes);
router.get("/search", searchNotes);

export { router as noteRoutes };
