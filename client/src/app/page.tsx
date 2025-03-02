"use client";

import NoteForm from "@/components/NoteForm";
import NoteList from "@/components/NoteList";
import NoteTranscription from "@/components/NoteTranscription";

export default function Home() {
  return (
    <main className="container mx-auto p-16">
      <h1 className="text-3xl font-bold mb-4">AI Note-Taking App</h1>
      <NoteForm />
      <NoteTranscription />
      <NoteList />
    </main>
  );
}
