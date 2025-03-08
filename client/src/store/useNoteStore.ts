import { create } from "zustand";
import {
  _createNote,
  _deleteNoteById,
  _fetchAllNotes,
  _semanticSearchNotes,
  _updateNote,
} from "@/app/api/postgresRequests";
import { Note, NoteStore } from "@/types/note";

export const useNoteStore = create<NoteStore>((set) => ({
  allNotes: [],
  aiResponse: "",
  deleteModalIsOpen: false,
  setDeleteModalState: (isOpen: boolean) => {
    set(() => ({
      deleteModalIsOpen: isOpen,
    }));
  },
  semanticDeleteModalIsOpen: false,
  setSemanticDeleteModalState: (isOpen: boolean) => {
    set(() => ({
      deleteModalIsOpen: isOpen,
    }));
  },
  noteToDelete: undefined,
  setNoteToDelete: (note: Note | undefined) => {
    set(() => ({
      noteToDelete: note,
    }));
  },
  updateAiResponse: (value: string | undefined) => {
    set(() => ({
      aiResponse: value,
    }));
  },
  fetchNotes: async () => {
    const data = await _fetchAllNotes();
    set({ allNotes: data });
  },
  addNote: async ({ title, content }) => {
    const note = await _createNote({ title, content });
    set((state) => ({
      allNotes: [...state.allNotes, note],
    }));
  },
  deleteNote: async (id) => {
    const deleteSuccessful = await _deleteNoteById(id);
    if (deleteSuccessful) {
      set((state) => ({
        allNotes: state.allNotes.filter((note) => note.id !== id),
        deleteModalIsOpen: false,
      }));
    }
  },
  updateNote: async (id, { title, content }) => {
    const updatedNote = await _updateNote(id, { title, content });
    set((state) => ({
      allNotes: state.allNotes.map((note) =>
        note.id === id ? updatedNote : note
      ),
    }));
  },
  semanticSearchNotes: async (query) => {
    const result = await _semanticSearchNotes(query);
    set({
      allNotes: result.notes,
      aiResponse: result.message,
    });
  },
}));
