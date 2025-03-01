export interface Note {
  id: number;
  title: string;
  content: string;
}

export type NewNote = Omit<Note, "id">;

export type NoteStore = {
  notes: Note[];
  fetchNotes: () => Promise<void>;
  addNote: ({ title, content }: NewNote) => Promise<void>;
  deleteNote: (id: number) => Promise<void>;
  updateNote: (id: number, { title, content }: NewNote) => Promise<void>;
  searchNotes: (query: string) => Promise<void>;
};
