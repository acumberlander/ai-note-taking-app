import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NoteForm from '../NoteForm';
import { useForm } from '@/hooks/useForm';

// Mock the useForm hook
jest.mock('@/hooks/useForm', () => ({
  useForm: jest.fn().mockReturnValue({
    title: '',
    filter: '',
    content: '',
    isFilter: false,
    noteFormLoading: false,
    setTitle: jest.fn(),
    setContent: jest.fn(),
    setIsFilter: jest.fn(),
    handleSubmit: jest.fn(),
    refreshNotes: jest.fn(),
    handleSearchChange: jest.fn(),
  }),
}));

// Mock the useSpeechToText hook
jest.mock('@/app/api/useSpeechToText', () => ({
  useSpeechToText: jest.fn().mockReturnValue({
    startRecording: jest.fn(),
    stopRecording: jest.fn(),
    isRecording: false,
    isTranscribing: false,
    text: '',
  }),
}));

describe('NoteForm Component', () => {
  const mockSetQuery = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form with title and content inputs', () => {
    render(<NoteForm setQuery={mockSetQuery} />);
    
    expect(screen.getByPlaceholderText(/title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/content/i)).toBeInTheDocument();
  });

  it('shows create and filter mode buttons', () => {
    render(<NoteForm setQuery={mockSetQuery} />);
    
    expect(screen.getByText('Create')).toBeInTheDocument();
    expect(screen.getByText('Filter')).toBeInTheDocument();
  });

  it('shows refresh button', () => {
    render(<NoteForm setQuery={mockSetQuery} />);
    
    expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
  });

  it('creates a new note when form is submitted', async () => {
    const mockHandleSubmit = jest.fn();
    (useForm as jest.Mock).mockReturnValue({
      title: 'New Note',
      filter: '',
      content: 'New Note Content',
      isFilter: false,
      noteFormLoading: false,
      setTitle: jest.fn(),
      setContent: jest.fn(),
      setIsFilter: jest.fn(),
      handleSubmit: mockHandleSubmit,
      refreshNotes: jest.fn(),
      handleSearchChange: jest.fn(),
    });

    render(<NoteForm setQuery={mockSetQuery} />);
    
    const submitButton = screen.getByRole('button', { name: /add note/i });
    fireEvent.click(submitButton);
    
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('does not submit form when title is empty', async () => {
    const mockHandleSubmit = jest.fn();
    (useForm as jest.Mock).mockReturnValue({
      title: '',
      filter: '',
      content: 'New Note Content',
      isFilter: false,
      noteFormLoading: false,
      setTitle: jest.fn(),
      setContent: jest.fn(),
      setIsFilter: jest.fn(),
      handleSubmit: mockHandleSubmit,
      refreshNotes: jest.fn(),
      handleSearchChange: jest.fn(),
    });

    render(<NoteForm setQuery={mockSetQuery} />);
    
    const submitButton = screen.getByRole('button', { name: /add note/i });
    fireEvent.click(submitButton);
    
    expect(mockHandleSubmit).not.toHaveBeenCalled();
  });

  it('does not submit form when content is empty', async () => {
    const mockHandleSubmit = jest.fn();
    (useForm as jest.Mock).mockReturnValue({
      title: 'New Note',
      filter: '',
      content: '',
      isFilter: false,
      noteFormLoading: false,
      setTitle: jest.fn(),
      setContent: jest.fn(),
      setIsFilter: jest.fn(),
      handleSubmit: mockHandleSubmit,
      refreshNotes: jest.fn(),
      handleSearchChange: jest.fn(),
    });

    render(<NoteForm setQuery={mockSetQuery} />);
    
    const submitButton = screen.getByRole('button', { name: /add note/i });
    fireEvent.click(submitButton);
    
    expect(mockHandleSubmit).not.toHaveBeenCalled();
  });
}) 