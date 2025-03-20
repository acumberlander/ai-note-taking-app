import { _User } from "./_user";
export interface Note {
  id: number;
  user_id: string | null;
  title: string;
  content: string;
  contentHidden?: boolean;
  isTemporary?: boolean;
}

export type NewNote = Omit<Note, "id">;

export type NoteStore = {
  // Values
  allNotes: Note[];
  aiResponse?: string;
  deleteModalIsOpen: boolean;
  noteFormLoading: boolean;
  noteListLoading: boolean;
  queryIntent: string;
  semanticDeleteModalIsOpen: boolean;
  semanticEditModalIsOpen: boolean;
  semanticSensitivity: number;
  noteToDelete?: Note;
  queriedNotes: Note[];
  editedNotes: Note[];
  lastQuery: string;
  lastIntent: string | null;
  lastSensitivity: number;
  isTemporary: boolean;

  // Functions
  setSemanticSensitivity: (sensitivity: number) => void;
  setNoteListLoading: (loadingState: boolean) => void;
  setNoteFormLoading: (loadingState: boolean) => void;
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
  updateAiResponse: (response: string) => void;
  fetchNotes: (user_id: string | null) => Promise<void>;
  deleteNote: (id: number) => Promise<void>;
  deleteNotes: (notes: Note[]) => Promise<void>;
  updateNotes: (notes: Note[]) => Promise<boolean>;
  updateNote: (
    id: number,
    { title, content, user_id }: NewNote
  ) => Promise<void>;
  semanticQuery: (query: string) => Promise<void>;
};
