import { create } from "zustand";

type Note = {
  id: number;
  title: string;
  content: string;
};

type NoteStore = {
  notes: Note[];
  fetchNotes: () => Promise<void>;
  addNote: (title: string, content: string) => Promise<void>;
  deleteNote: (id: number) => Promise<void>;
};

export const useNoteStore = create<NoteStore>((set) => ({
  notes: [],
  fetchNotes: async () => {
    const res = await fetch("/api/notes");
    const data = await res.json();
    set({ notes: data });
  },
  addNote: async (title, content) => {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    if (res.ok) {
      set((state) => ({
        notes: [...state.notes, { id: Date.now(), title, content }],
      }));
    }
  },
  deleteNote: async (id) => {
    const res = await fetch("/api/notes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      set((state) => ({
        notes: state.notes.filter((note) => note.id !== id),
      }));
    }
  },
}));
