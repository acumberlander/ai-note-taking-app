import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  _createNote,
  _deleteNoteById,
  _deleteNotes,
  _fetchAllNotes,
  _semanticQuery,
  _updateNote,
  _updateNotes,
} from "@/app/api/postgresRequests";
import { Note, NoteStore } from "@/types/note";
import { _User } from "@/types/_user";
import { useUserStore } from "./useUserStore";

export const useNoteStore = create<NoteStore>()(
  devtools((set) => ({
    // State Values
    allNotes: [],
    aiResponse: "",
    queryIntent: "",
    isLoading: true,
    editedNotes: [],
    deleteModalIsOpen: false,
    semanticDeleteModalIsOpen: false,
    semanticEditModalIsOpen: false,
    noteToDelete: undefined,

    // State functions
    setQueriedNotes: (notes: Note[] | undefined) => {
      set(() => ({
        queriedNotes: notes,
      }));
    },
    setEditedNotes: (updatedNotes: Note[]) => {
      set(() => ({
        editedNotes: updatedNotes,
      }));
    },
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
    setDeleteModalState: (isOpen: boolean) => {
      set(() => ({
        deleteModalIsOpen: isOpen,
      }));
    },
    setSemanticDeleteModalState: (isOpen: boolean) => {
      set(() => ({
        semanticDeleteModalIsOpen: isOpen,
      }));
    },
    setSemanticEditModalState: (isOpen: boolean) => {
      set(() => ({
        semanticEditModalIsOpen: isOpen,
      }));
    },
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
    fetchNotes: async (user_id) => {
      set({ isLoading: true });
      if (user_id) {
        const data = await _fetchAllNotes(user_id);
        set({ allNotes: [...data], isLoading: false });
      }
    },
    addNote: async ({ title, content, user_id }) => {
      const note = await _createNote({ title, content, user_id });
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
      const { user } = useUserStore.getState();
      const user_id = user?.id || null;
      const deleteSuccessful = await _deleteNotes(notes, user_id);
      if (deleteSuccessful) {
        set((state) => ({
          allNotes: state.allNotes.filter(
            (note) => !notes.some((_note) => note.id === _note.id)
          ),
          semanticDeleteModalIsOpen: false,
        }));
      }
    },
    updateNotes: async (oldNotes: Note[]) => {
      const { notes: updatedNotes, message } = await _updateNotes(oldNotes);
      if (updatedNotes.length > 0) {
        set((state) => ({
          allNotes: state.allNotes.map((note) => {
            const updatedNote = updatedNotes.find(
              (updated) => updated.id === note.id
            );
            return updatedNote || note;
          }),
          queriedNotes: updatedNotes,
        }));

        // Ensure that UI updates by explicitly triggering a state change
        set((state) => ({ allNotes: [...state.allNotes] }));

        return true;
      }
      return false;
    },
    updateNote: async (id, { title, content, user_id }) => {
      const updatedNote = await _updateNote(id, { title, content, user_id });
      set((state) => ({
        allNotes: state.allNotes.map((note) =>
          note.id === id ? updatedNote : note
        ),
      }));
    },
    semanticQuery: async (query) => {
      const { user } = useUserStore.getState();
      const user_id = user?.id || null;
      const result = await _semanticQuery(query, user_id);
      if (
        (result.intent === "delete_notes" || result.intent === "delete_all") &&
        result.notes.length > 0
      ) {
        set({
          allNotes: result.notes,
          aiResponse: result.message,
          queryIntent: result.intent,
          queriedNotes: result.notes,
          semanticDeleteModalIsOpen: true,
        });
      } else if (result.intent === "edit_notes") {
        set({
          allNotes: result.notes,
          aiResponse: result.message,
          queryIntent: result.intent,
          queriedNotes: result.notes,
          editedNotes: result.editedNotes,
          semanticEditModalIsOpen: true,
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
