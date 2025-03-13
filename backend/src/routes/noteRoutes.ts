import express from "express";
import {
  createNoteController,
  getNotesController,
  updateNotesController,
  deleteNotesController,
  getNoteByIdController,
  deleteNoteByIdController,
  updateNoteController,
  searchNotesController,
  semanticQueryController,
} from "../controllers/noteController";

const router = express.Router();

router.post("/", createNoteController);
router.get("/", getNotesController);
router.put("/", updateNotesController);
router.delete("/", deleteNotesController);
router.get("/:id", getNoteByIdController);
router.delete("/:id", deleteNoteByIdController);
router.put("/:id", updateNoteController);
router.get("/search", searchNotesController);
router.post("/semantic-query", semanticQueryController);

export { router as noteRoutes };
