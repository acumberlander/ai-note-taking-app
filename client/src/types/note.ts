export interface Note {
  id: number;
  title: string;
  content: string;
}

export type NewNote = Omit<Note, "id">;

export type NoteStore = {
  allNotes: Note[];
  aiResponse?: string;
  updateAiResponse: (value: string | undefined) => void;
  fetchNotes: () => Promise<void>;
  addNote: ({ title, content }: NewNote) => Promise<void>;
  deleteNote: (id: number) => Promise<void>;
  updateNote: (id: number, { title, content }: NewNote) => Promise<void>;
  semanticSearchNotes: (query: string) => Promise<void>;
};
