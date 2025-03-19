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
import { NewNote, Note, NoteStore } from "@/types/note";
import { _User } from "@/types/_user";
import { useUserStore } from "./useUserStore";
import { aiLoadingResponses } from "@/constants";
import { testNoteGroups } from "@/constants";
import { getActionVerb } from "@/utils/utils";

export const useNoteStore = create<NoteStore>()(
  devtools((set) => ({
    // State Values
    allNotes: [],
    aiResponse: "",
    queryIntent: "",
    noteListLoading: false,
    noteFormLoading: false,
    editedNotes: [],
    deleteModalIsOpen: false,
    semanticDeleteModalIsOpen: false,
    semanticEditModalIsOpen: false,
    noteToDelete: undefined,
    semanticSensitivity: 0.24,
    lastQuery: "",
    lastSensitivity: 0.24,
    potentialDuplicateNote: null,
    duplicateNoteModalIsOpen: false,

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
    setNoteListLoading: (loadingState: boolean) => {
      set(() => ({
        noteListLoading: loadingState,
      }));
    },
    setNoteFormLoading: (loadingState: boolean) => {
      set(() => ({
        noteFormLoading: loadingState,
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
    setSemanticSensitivity: (sensitivity: number) =>
      set({ semanticSensitivity: sensitivity }),
    fetchNotes: async (user_id: string | null) => {
      set({ noteListLoading: true });
      const data = await _fetchAllNotes(user_id || "");

      set({ allNotes: [...data], noteListLoading: false });
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
      const { semanticSensitivity, lastQuery, lastSensitivity } =
        useNoteStore.getState();
      const user_id = user?.id || null;

      // Check if this is a repeated query with same sensitivity
      const isRepeatedQuery =
        query === lastQuery && semanticSensitivity === lastSensitivity;

      try {
        // Only make API call if query is new or sensitivity changed
        let result;
        if (!isRepeatedQuery) {
          set({
            aiResponse: aiLoadingResponses[Math.floor(Math.random() * 5)],
            noteListLoading: true,
            lastQuery: query,
            lastSensitivity: semanticSensitivity,
          });
          result = await _semanticQuery(query, user_id, semanticSensitivity);

          if (result) {
            // Update state with the returned notes and intent
            set({
              allNotes:
                result.intent === "create_note"
                  ? [...useNoteStore.getState().allNotes, ...result.notes]
                  : result.notes,
              aiResponse: result.message,
              queryIntent: result.intent,
              noteListLoading: false,
              queriedNotes: result.notes || [],
              editedNotes: result.editedNotes || [],
            });

            // Handle specific intents
            if (
              result.intent === "edit_notes" &&
              result.editedNotes &&
              result.editedNotes.length > 0
            ) {
              // Open the semantic edit modal
              set({ semanticEditModalIsOpen: true });
            } else if (
              result.intent === "delete_notes" ||
              result.intent === "delete_all"
            ) {
              // Open the semantic delete modal
              set({ semanticDeleteModalIsOpen: true });
            }
          }
        } else {
          // Use existing state for repeated queries
          const state = useNoteStore.getState();
          result = {
            notes: state.allNotes,
            editedNotes: state.editedNotes,
            message: `I've already ${getActionVerb(
              state.queryIntent
            )} based on "${query}". Maybe change the sensitivity?`,
            intent: state.queryIntent,
          };

          set({
            aiResponse: result.message,
            noteListLoading: false,
          });
        }
      } catch (error) {
        console.error("Error in semantic query:", error);
        set({
          aiResponse: "Sorry, I encountered an error processing your request.",
          noteListLoading: false,
        });
      }
    },
  }))
);
