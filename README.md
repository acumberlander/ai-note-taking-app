# Whispr - AI Note Taking App

Whispr is an AI-powered note-taking application with advanced features like semantic search, speech-to-text transcription, and AI-assisted note management.

## Features

- **Speech-to-Text Notes**: Record voice memos and convert them to text
- **Semantic Search**: Find notes based on meaning, not just keywords
- **Intent Classification**: Use natural language to execute commands (search, create, delete)
- **AI-Generated Titles**: Automatically create relevant titles for your notes
- **Semantic Delete**: Remove notes based on content similarity
- **Voice Commands**: Control the application using natural speech
- **Work in Progress**: Adding semantic editing and creation directly through the query feature

## Tech Stack

### Backend

- Node.js with Express
- TypeScript
- PostgreSQL with pgvector extension (for semantic search)
- OpenAI API (for embeddings, transcription, and content generation)
- AWS SDK for storage
- Multer for file uploads

### Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Zustand for state management
- Axios for API requests

## Prerequisites

- Node.js (v16+)
- PostgreSQL (v14+) with pgvector extension installed
- OpenAI API key

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

Install PostgreSQL and connect to it. Then run the following commands:

```sql
-- Create a new database
CREATE DATABASE whispr;

-- Connect to the database
\c whispr

-- Install the vector extension for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- Create notes table with vector embedding support
CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding VECTOR(1536)
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
DATABASE_URL=postgres://username:password@localhost:5432/whispr
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
│   │   ├── db.ts        # Database connection
│   │   └── index.ts     # Server entry point
│   └── uploads/         # Temporary audio file storage
└── client/              # Next.js frontend
    ├── public/          # Static assets
    └── src/             # Source files
        ├── app/         # Next.js app router
        ├── components/  # React components
        └── hooks/       # Custom React hooks
```
