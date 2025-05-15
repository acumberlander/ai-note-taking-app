import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
// Mock Supabase client
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
}));
import NoteList from '../NoteList'
import { Note as NoteType } from '@/types/note'

// Mock the Note component
jest.mock('../Note', () => {
  return function MockNote({ note }: { note: NoteType }) {
    return (
      <div data-testid={`note-${note.id}`}>
        <h2>{note.title}</h2>
        <p>{note.content}</p>
      </div>
    )
  }
})

describe('NoteList Component', () => {
  const mockNotes: NoteType[] = [
    {
      id: 1,
      title: 'First Note',
      content: 'First Note Content',
      user_id: 'user1',
    },
    {
      id: 2,
      title: 'Second Note',
      content: 'Second Note Content',
      user_id: 'user1',
    },
  ]

  const mockCreateTestNotes = jest.fn()

  it('renders list of notes', () => {
    render(
      <NoteList
        notes={mockNotes}
        query=""
        createTestNotes={mockCreateTestNotes}
      />
    )
    
    expect(screen.getByTestId('note-1')).toBeInTheDocument()
    expect(screen.getByTestId('note-2')).toBeInTheDocument()
    expect(screen.getByTestId('note-1').querySelector('h2')).toHaveTextContent('First Note')
    expect(screen.getByTestId('note-2').querySelector('h2')).toHaveTextContent('Second Note')
  })

  it('renders empty state when no notes are provided', () => {
    render(
      <NoteList
        notes={[]}
        query=""
        createTestNotes={mockCreateTestNotes}
      />
    )
    
    expect(screen.getByText(/no notes found/i)).toBeInTheDocument()
    expect(screen.getByText(/get started by creating your own notes/i)).toBeInTheDocument()
  })
}) 