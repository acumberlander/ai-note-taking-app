import express from "express";
import {
  createUserController,
  fetchUserNotesController,
  fetchUserController,
} from "../controllers/userController";

const router = express.Router();

router.post("/", createUserController);
router.get("/:id", fetchUserController);
router.get("/:id/notes", fetchUserNotesController);

export { router as userRoutes };
