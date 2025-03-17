import { _User } from "./_user";
export interface Note {
  id: number;
  user_id: string | null;
  title: string;
  content: string;
  contentHidden?: boolean;
}

export type NewNote = Omit<Note, "id">;

export type NoteStore = {
  // Values
  allNotes: Note[];
  aiResponse?: string;
  deleteModalIsOpen: boolean;
  isLoading: boolean;
  queryIntent: string;
  semanticDeleteModalIsOpen: boolean;
  semanticEditModalIsOpen: boolean;
  noteToDelete?: Note;
  queriedNotes: Note[];
  editedNotes: Note[];

  // Functions
  setIsLoading: (loadingState: boolean) => void;
  setQueryIntent: (intent: string) => void;
  /**
   * Opens or closes the delete note modal based on the boolean passed in.
   * @param isOpen
   * @returns
   */
  setDeleteModalState: (isOpen: boolean) => void;
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
  setNoteToDelete: (note: Note) => void;
  setNotesToEdit: (notes: Note[]) => void;
  setEditedNotes: (notes: Note[]) => void;
  setNotesToDelete: (notes: Note[]) => void;
  updateAiResponse: (value: string | undefined) => void;
  fetchNotes: (user_id: string | null) => Promise<void>;
  addNote: ({ title, content, user_id }: NewNote) => Promise<void>;
  deleteNote: (id: number) => Promise<void>;
  deleteNotes: (notes: Note[]) => Promise<void>;
  updateNotes: (notes: Note[]) => Promise<boolean>;
  updateNote: (id: number, { title, content }: NewNote) => Promise<void>;
  semanticQuery: (query: string) => Promise<void>;
};
