# WhisprNotes - AI Note Taking App

WhisprNotes is an AI-powered note-taking application with advanced features like semantic search, speech-to-text transcription, and AI-assisted note management.

## Features

### Traditional Note Management

- **Create Notes**: Manually create notes with custom titles and content
- **Read Notes**: View and browse all your saved notes
- **Update Notes**: Edit existing notes to modify their content
- **Delete Notes**: Remove individual notes when no longer needed

### Semantic Note Management

- **Semantic Create**: Generate new notes using natural language commands or voice input
- **Semantic Search**: Find notes based on meaning and context, not just keywords
- **Semantic Update**: Modify notes by describing the changes you want to make
- **Semantic Delete**: Remove notes by describing their content or topic

### Additional Features

- **Speech-to-Text**: Record voice memos and convert them to text notes
- **AI-Generated Titles**: Automatically create relevant titles for your notes
- **Voice Commands**: Control the application using natural speech
- **Intent Classification**: System understands whether you want to search, create, or delete

## AI Models Used

- **GPT-4o**: Used for content generation, intent classification, and understanding natural language commands
- **Whisper-1**: Powers the speech-to-text transcription functionality
- **text-embedding-ada-002**: Creates vector embeddings for semantic search capabilities

## Tech Stack

### Backend

- Node.js with Express
- TypeScript
- PostgreSQL with pgvector extension (via Supabase)
- OpenAI API (for embeddings, transcription, and content generation)
- Multer for file uploads

### Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Zustand for state management
- Axios for API requests
- Supabase for authentication and database

## Prerequisites

- Node.js (v16+)
- PostgreSQL (v14+) with pgvector extension installed (or Supabase account)
- OpenAI API key
- Supabase account and API keys

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/acumberlander/ai-note-taking-app.git
cd ai-note-taking-app
```

### 2. Install root dependencies

```bash
npm install
```

### 3. Database Setup

Create a Supabase project and enable the vector extension:

```sql
-- Connect to your Supabase database and run:
CREATE EXTENSION IF NOT EXISTS vector;

-- Create notes table with vector embedding support
CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding VECTOR(1536),
  user_id TEXT
);

-- Create an index for faster similarity search
CREATE INDEX ON notes USING hnsw (embedding vector_cosine_ops);
```

### 4. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with the following variables:

```
DATABASE_URL=your_supabase_postgres_connection_string
OPENAI_API_KEY=your_openai_api_key
PG_PASSWORD=your_postgres_password
PG_USER=your_postgres_username
PG_PORT=5432
```

### 5. Frontend Setup

```bash
cd ../client
npm install
```

Create a `.env.local` file in the client directory:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 6. Run the development servers

From the root directory:

```bash
# Run both frontend and backend concurrently
npm run dev

# Or run them separately
npm run start:backend
npm run start:client
```

- Frontend will be available at: http://localhost:3000
- Backend will be available at: http://localhost:5000

## API Endpoints

### Notes API

- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create a new note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note
- `DELETE /api/notes` - Delete multiple notes by content similarity
- `POST /api/notes/semantic-query` - Perform semantic search with intent classification

### Transcription API

- `POST /api/transcribe` - Transcribe audio file to text

### User API

- `POST /api/users` - Create or get user data

## Building for Production

```bash
# Build the backend
cd backend
npm run build

# Build the frontend
cd ../client
npm run build
```

## Project Structure

```
ai-note-taking-app/
├── backend/             # Express API server
│   ├── src/             # Source files
│   │   ├── controllers/ # API controllers
│   │   ├── middleware/  # Express middleware
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   ├── db.ts        # Database connection
│   │   └── index.ts     # Server entry point
└── client/              # Next.js frontend
    ├── public/          # Static assets
    └── src/             # Source files
        ├── app/         # Next.js app router
        ├── components/  # React components
        ├── hooks/       # Custom React hooks
        ├── lib/         # Utility functions
        └── store/       # Zustand state management
```
