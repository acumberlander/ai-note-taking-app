"use client";

import { useState } from "react";
import NoteForm from "@/components/NoteForm";
import NoteList from "@/components/NoteList";
import NoteTranscription from "@/components/NoteTranscription";
import DeleteModal from "@/components/DeleteModal";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="container mx-auto p-16">
      <h1 className="text-3xl font-bold mb-4">AI Note-Taking App</h1>
      <NoteForm setSearchQuery={setSearchQuery} />
      <NoteTranscription />
      <NoteList searchQuery={searchQuery} />
      <DeleteModal />
    </main>
  );
}
