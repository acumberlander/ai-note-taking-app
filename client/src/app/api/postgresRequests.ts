import { _User } from "@/types/_user";
import { NewNote, Note } from "@/types/note";
import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Fetch all notes from the backend.
 * @param id
 */
export const _fetchAllNotes = async (id: string): Promise<Note[]> => {
  const res = await axios.get(`${baseUrl}/api/notes/user/${id}`);
  return res.data;
};

/**
 * Fetch a single note by ID.
 * @param id
 * @param user_id Optional user ID to verify ownership
 */
export const _fetchNoteById = async (
  id: number,
  user_id?: string | null
): Promise<Note> => {
  const res = await axios.get(`${baseUrl}/api/notes/${id}`, {
    params: { user_id },
  });
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
 * Create a new user.
 * @param id
 */
export const _createUser = async (
  id: string,
  is_anonymous: boolean
): Promise<_User> => {
  const res = await axios.post(`${baseUrl}/api/users`, {
    id,
    is_anonymous,
  });
  return res.data;
};

/**
 * Create a new user.
 * @param id
 */
export const _fetchUser = async (id: string): Promise<_User> => {
  const res = await axios.get(`${baseUrl}/api/users/${id}`);
  console.log("_fetchUser: ", res.data);
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
 * @param user_id Optional user ID to filter notes by user
 * @param sensitivity Optional sensitivity value (0.1-0.9, lower = more results)
 */
export const _semanticQuery = async (
  query: string,
  user_id?: string | null,
  sensitivity?: number
): Promise<{
  notes: Note[];
  editedNotes: Note[];
  message: string;
  intent: string;
} | null> => {
  const res = await axios.post(`${baseUrl}/api/notes/semantic-query`, {
    query,
    user_id,
    sensitivity,
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
 * Update multiple notes.
 * @param notes
 */
export const _updateNotes = async (
  notes: Note[]
): Promise<{ notes: Note[]; message: string }> => {
  const res = await axios.put(`${baseUrl}/api/notes`, { notes });
  console.log("_updateNotes: ", res.data);
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

/**
 * Delete multiple notes.
 * @param notes - Array of Note objects.
 * @param user_id Optional user ID to verify ownership
 */
export const _deleteNotes = async (
  notes: Note[],
  user_id?: string | null
): Promise<boolean> => {
  const noteIds = notes.map((note) => note.id);
  const res = await axios.delete(`${baseUrl}/api/notes`, {
    data: { noteIds, user_id },
  });
  return res.status === 200;
};
