export interface Note {
  id: number;
  title: string;
  content: string;
  contentHidden?: boolean;
}

export type NewNote = Omit<Note, "id">;

export type NoteStore = {
  allNotes: Note[];
  aiResponse?: string;
  deleteModalIsOpen: boolean;
  isLoading: boolean;
  setIsLoading: (loadingState: boolean) => void;
  queryIntent: string;
  setQueryIntent: (intent: string) => void;
  /**
   * Opens or closes the delete note modal based on the boolean passed in.
   * @param isOpen
   * @returns
   */
  setDeleteModalState: (isOpen: boolean) => void;
  semanticDeleteModalIsOpen: boolean;
  /**
   * Opens or closes the semantic delete note modal based on the boolean passed in.
   * @param isOpen
   * @returns
   */
  setSemanticDeleteModalState: (isOpen: boolean) => void;
  noteToDelete?: Note;
  setNoteToDelete: (note: Note) => void;
  notesToDelete: Note[];
  setNotesToDelete: (notes: Note[]) => void;
  updateAiResponse: (value: string | undefined) => void;
  fetchNotes: () => Promise<void>;
  addNote: ({ title, content }: NewNote) => Promise<void>;
  deleteNote: (id: number) => Promise<void>;
  deleteNotes: (notes: Note[]) => Promise<void>;
  updateNote: (id: number, { title, content }: NewNote) => Promise<void>;
  semanticQuery: (query: string) => Promise<void>;
};
