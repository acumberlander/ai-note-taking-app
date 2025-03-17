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
  noteFormLoading: boolean;
  noteListLoading: boolean;
  setNoteListLoading: (loadingState: boolean) => void;
  setNoteFormLoading: (loadingState: boolean) => void;
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
  /**
   * Opens or closes the semantic edit note modal based on the boolean passed in.
   * @param isOpen
   * @returns
   */
  setSemanticEditModalState: (isOpen: boolean) => void;
  semanticEditModalIsOpen: boolean;
  noteToDelete?: Note;
  setNoteToDelete: (note: Note) => void;
  setNotesToEdit: (notes: Note[]) => void;
  queriedNotes: Note[];
  editedNotes: Note[];
  setEditedNotes: (notes: Note[]) => void;
  setNotesToDelete: (notes: Note[]) => void;
  updateAiResponse: (value: string | undefined) => void;
  fetchNotes: () => Promise<void>;
  addNote: ({ title, content }: NewNote) => Promise<void>;
  deleteNote: (id: number) => Promise<void>;
  deleteNotes: (notes: Note[]) => Promise<void>;
  updateNotes: (notes: Note[]) => Promise<boolean>;
  updateNote: (id: number, { title, content }: NewNote) => Promise<void>;
  semanticQuery: (query: string) => Promise<void>;
};
