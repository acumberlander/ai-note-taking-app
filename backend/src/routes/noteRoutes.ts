import express from "express";
import WebSocket, { WebSocketServer } from "ws";
import { pool } from "../db";
import dotenv from "dotenv";
dotenv.config();

import {
  createNote,
  getNotes,
  getNoteById,
  searchNotes,
  semanticQuery,
  deleteNoteById,
  updateNote,
} from "../controllers/noteController";

const router = express.Router();

router.post("/", createNote);
router.get("/", getNotes);
router.get("/search", searchNotes);
router.post("/semantic-query", semanticQuery);
router.get("/:id", getNoteById);
router.delete("/:id", deleteNoteById);
router.put("/:id", updateNote);

const wss = new WebSocketServer({ port: Number(process.env.WS_PORT) });
const clients = new Set<WebSocket>();

// When a client connects
wss.on("connection", (ws) => {
  console.log("Client connected");
  clients.add(ws);

  ws.on("close", () => {
    console.log("Client disconnected");
    clients.delete(ws);
  });
});

const fetchNotesFromDB = async () => {
  try {
    const result = await pool.query("SELECT * FROM notes");
    return result.rows;
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
};

// Broadcast updates to all connected clients
export const broadcastUpdate = async () => {
  const allNotes = await fetchNotesFromDB(); // Get notes from the database
  const message = JSON.stringify({ type: "update", notes: allNotes });

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

export { router as noteRoutes };
