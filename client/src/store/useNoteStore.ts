import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  _createNote,
  _deleteNoteById,
  _deleteNotes,
  _fetchAllNotes,
  _semanticQuery,
  _updateNote,
} from "@/app/api/postgresRequests";
import { Note, NoteStore } from "@/types/note";

export const useNoteStore = create<NoteStore>()(
  devtools((set) => ({
    allNotes: [],
    aiResponse: "",
    queryIntent: "",
    isLoading: true,
    setIsLoading: (loadingState: boolean) => {
      set(() => ({
        isLoading: loadingState,
      }));
    },
    setQueryIntent: (intent: string) => {
      set(() => ({
        queryIntent: intent,
      }));
    },
    deleteModalIsOpen: false,
    setDeleteModalState: (isOpen: boolean) => {
      set(() => ({
        deleteModalIsOpen: isOpen,
      }));
    },
    semanticDeleteModalIsOpen: false,
    setSemanticDeleteModalState: (isOpen: boolean) => {
      set(() => ({
        semanticDeleteModalIsOpen: isOpen, // corrected property
      }));
    },
    noteToDelete: undefined,
    setNoteToDelete: (note: Note | undefined) => {
      set(() => ({
        noteToDelete: note,
      }));
    },
    notesToDelete: [],
    setNotesToDelete: (notes: Note[] | undefined) => {
      set(() => ({
        notesToDelete: notes,
      }));
    },
    updateAiResponse: (value: string | undefined) => {
      set(() => ({
        aiResponse: value,
      }));
    },
    fetchNotes: async () => {
      const data = await _fetchAllNotes();
      set({ allNotes: data, isLoading: false });
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
    deleteNotes: async (notes: Note[]) => {
      const deleteSuccessful = await _deleteNotes(notes);
      if (deleteSuccessful) {
        set((state) => ({
          allNotes: state.allNotes.filter(
            (note) => !notes.some((_note) => note.id === _note.id)
          ),
          semanticDeleteModalIsOpen: false,
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
    semanticQuery: async (query) => {
      const result = await _semanticQuery(query);
      if (result.intent === "delete_notes" && result.notes.length > 0) {
        set({
          allNotes: result.notes,
          aiResponse: result.message,
          queryIntent: result.intent,
          notesToDelete: result.notes,
          semanticDeleteModalIsOpen: true,
        });
      } else {
        set({
          allNotes: result.notes,
          aiResponse: result.message,
          queryIntent: result.intent,
        });
      }
    },
  }))
);
