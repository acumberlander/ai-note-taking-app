"use client";

import NoteForm from "@/components/NoteForm";
import NoteList from "@/components/NoteList";
import NoteTranscription from "@/components/NoteTranscription";
import DeleteModal from "@/components/DeleteModal";
import SemanticDeleteModal from "@/components/SemanticDeleteModal";
import { Mosaic } from "react-loading-indicators";
import { useNoteStore } from "@/store/useNoteStore";
import useNotes from "@/hooks/useNotes";
import SemanticEditModal from "@/components/SemanticEditModal";
import { useForm } from "@/hooks/useForm";

export default function Home() {
  const { isLoading } = useNoteStore();
  const { query, setQuery, filteredNotes } = useNotes();
  const { refreshNotes } = useForm({ setQuery });

  return (
    <main className="container mx-auto p-16">
      <h1 className="text-3xl font-bold mb-4">AI Note-Taking App</h1>
      <NoteForm setQuery={setQuery} />
      <NoteTranscription />
      {isLoading ? (
        <div className="flex justify-center pt-80">
          <Mosaic color="#2a9cef" size="large" text="Loading" textColor="" />
        </div>
      ) : (
        <>
          <NoteList notes={filteredNotes} query={query} />
          <DeleteModal />
          <SemanticDeleteModal />
          <SemanticEditModal refreshNotes={refreshNotes} />
        </>
      )}
    </main>
  );
}
