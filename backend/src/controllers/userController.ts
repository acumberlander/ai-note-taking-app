import { Request, Response } from "express";
import { User } from "../models/userModel";
import { pool } from "../db";

/**
 * Controller to create a new user
 * @param req
 * @param res
 */
export const createUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id, is_anonymous } = req.body;
    if (!id) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    const result = await pool.query(
      `
      INSERT INTO users (id, is_anonymous)
      VALUES ($1, $2)
      ON CONFLICT (id) DO NOTHING
      RETURNING *
      `,
      [id, is_anonymous || false]
    );

    res.status(201).json(result.rows[0] || { message: "User already exists" });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
};

/**
 * Controller to fetch user's notes
 * @param req
 * @param res
 */
export const fetchUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    const user = await User.fetchUserById(id);

    if (!user) {
      res.json({
        message: "There are no users with that id...",
        data: null,
      });
      return;
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching user notes:", err);
    res.status(500).json({ error: "Failed to fetch user notes" });
  }
};

/**
 * Controller to fetch user's notes
 * @param req
 * @param res
 */
export const fetchUserNotesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    const notes = await User.fetchNotesByUserId(id);

    if (!notes) {
      res.status(404).json({ error: "User not found or has no notes" });
      return;
    }

    res.json(notes);
  } catch (err) {
    console.error("Error fetching user notes:", err);
    res.status(500).json({ error: "Failed to fetch user notes" });
  }
};
