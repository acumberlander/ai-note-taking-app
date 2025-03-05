import { create } from "zustand";
import {
  _createNote,
  _deleteNoteById,
  _fetchAllNotes,
  _searchNotes,
  _semanticSearchNotes,
  _updateNote,
} from "@/app/api/postgresRequests";
import { NoteStore } from "@/types/note";

export const useNoteStore = create<NoteStore>((set) => ({
  notes: [],
  fetchNotes: async () => {
    const data = await _fetchAllNotes();
    set({ notes: data });
  },
  addNote: async ({ title, content }) => {
    const note = await _createNote({ title, content });
    set((state) => ({
      notes: [...state.notes, note],
    }));
  },
  deleteNote: async (id) => {
    const deleteSuccessful = await _deleteNoteById(id);
    if (deleteSuccessful) {
      set((state) => ({
        notes: state.notes.filter((note) => note.id !== id),
      }));
    }
  },
  updateNote: async (id, { title, content }) => {
    const updatedNote = await _updateNote(id, { title, content });
    set((state) => ({
      notes: [...state.notes.filter((note) => note.id !== id), updatedNote],
    }));
  },
  searchNotes: async (query) => {
    const queriedNotes = await _searchNotes(query);
    set(() => ({ notes: queriedNotes }));
  },
  semanticSearchNotes: async (query) => {
    const { notes, message } = await _semanticSearchNotes(query);
    set({ notes, aiResponse: message });
    return { message };
  },
}));
