import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react'
import '@testing-library/jest-dom'
import Note from "../Note";
import { useNoteStore } from "@/store/useNoteStore";
import { useUserStore } from "@/store/useUserStore";
import { Note as NoteType } from "@/types/note";

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      then: jest.fn().mockResolvedValue({ data: [], error: null }),
    }),
  },
}))


// Mock the stores
jest.mock('@/store/useNoteStore')
jest.mock('@/store/useUserStore')

// Mock the motion component from framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => (
      <div {...props}>{children}</div>
    ),
  },
}))

describe('Note Component', () => {
  const mockNote: NoteType = {
    id: 1,
    title: 'Test Note',
    content: 'Test Content',
    user_id: 'user1',
  }

  const mockOnViewNote = jest.fn()
  const mockUpdateNote = jest.fn()
  const mockSetNoteToDelete = jest.fn()
  const mockSetDeleteModalState = jest.fn()
  const mockCreateNote = jest.fn()

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup store mocks
    (useNoteStore as unknown as jest.Mock).mockReturnValue({
      updateNote: mockUpdateNote,
      setNoteToDelete: mockSetNoteToDelete,
      setDeleteModalState: mockSetDeleteModalState,
      createNote: mockCreateNote,
    });

    (useUserStore as unknown as jest.Mock).mockReturnValue({
      user: { id: 'user1' },
    });
  })

  it('renders note with title and content', () => {
    render(<Note note={mockNote} onViewNote={mockOnViewNote} />);
    
    expect(screen.getByText('Test Note')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  })

  it('enters edit mode when edit button is clicked', () => {
    render(<Note note={mockNote} onViewNote={mockOnViewNote} />);
    
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(screen.getByDisplayValue('Test Note')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Content')).toBeInTheDocument();
  })

  it('saves note when save button is clicked', async () => {
    render(<Note note={mockNote} onViewNote={mockOnViewNote} />);
    
    // Enter edit mode
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    // Change title and content
    const titleInput = screen.getByDisplayValue('Test Note');
    const contentInput = screen.getByDisplayValue('Test Content');
    
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
    fireEvent.change(contentInput, { target: { value: 'Updated Content' } });

    // Save changes
    const saveButton = screen.getByText('Save');
    await act(async () => {
      fireEvent.click(saveButton);
    })

    await waitFor(() => {
      expect(mockUpdateNote).toHaveBeenCalledWith(1, {
        title: 'Updated Title',
        content: 'Updated Content',
        user_id: 'user1',
      });
    })
  })

  it('cancels edit mode when cancel button is clicked', () => {
    render(<Note note={mockNote} onViewNote={mockOnViewNote} />);
    
    // Enter edit mode
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    // Click cancel
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    // Should show original content
    expect(screen.getByText('Test Note')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  })

  it('opens delete modal when delete button is clicked', () => {
    render(<Note note={mockNote} onViewNote={mockOnViewNote} />);
    
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(mockSetNoteToDelete).toHaveBeenCalledWith(mockNote);
    expect(mockSetDeleteModalState).toHaveBeenCalledWith(true);
  })

  it('calls onViewNote when note is clicked', () => {
    render(<Note note={mockNote} onViewNote={mockOnViewNote} />);
    
    const noteElement = screen.getByText('Test Note').closest('div');
    fireEvent.click(noteElement!);

    expect(mockOnViewNote).toHaveBeenCalledWith(mockNote);
  })

  it('does not call onViewNote when in edit mode', () => {
    render(<Note note={mockNote} onViewNote={mockOnViewNote} />);
    
    // Enter edit mode
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    // Click the note
    const noteElement = screen.getByDisplayValue('Test Note').closest('div');
    fireEvent.click(noteElement!);

    expect(mockOnViewNote).not.toHaveBeenCalled();
  })
}) 