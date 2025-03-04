import { NewNote, Note } from "@/types/note";
import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Fetch all notes from the backend.
 */
export const _fetchAllNotes = async (): Promise<Note[]> => {
  const res = await axios.get(`${baseUrl}/api/notes`);
  return res.data;
};

/**
 * Fetch a single note by ID.
 * @param id
 */
export const _fetchNoteById = async (id: number): Promise<Note> => {
  const res = await axios.get(`${baseUrl}/api/notes/${id}`);
  return res.data;
};

/**
 * Create a new note.
 * @param note
 */
export const _createNote = async (note: NewNote): Promise<Note> => {
  const res = await axios.post(`${baseUrl}/api/notes`, note);
  return res.data;
};

/**
 * Search for notes by keyword.
 * @param query
 */
export const _searchNotes = async (query: string): Promise<Note[]> => {
  const res = await axios.get(`${baseUrl}/api/notes/search`, {
    params: { query },
  });
  return res.data;
};

/**
 * Search for notes by semantics.
 * @param query
 */
export const _semanticSearchNotes = async (
  query: string
): Promise<{ notes: Note[]; message: string }> => {
  const res = await axios.post(`${baseUrl}/api/notes/semantic-search`, {
    query,
  });
  return res.data;
};

/**
 * Update an existing note.
 * @param id
 * @param updatedNote
 */
export const _updateNote = async (
  id: number,
  updatedNote: NewNote
): Promise<Note> => {
  const res = await axios.put(`${baseUrl}/api/notes/${id}`, updatedNote);
  return res.data;
};

/**
 * Delete a single note by ID.
 * @param id
 */
export const _deleteNoteById = async (id: number): Promise<boolean> => {
  const res = await axios.delete(`${baseUrl}/api/notes/${id}`);
  return res.status === 200;
};
