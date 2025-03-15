"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
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
  const { user, loading } = useAuth();
  const router = useRouter();
  const { isLoading } = useNoteStore();
  const { query, setQuery, filteredNotes } = useNotes();
  const { refreshNotes } = useForm({ setQuery });

  // Redirect unauthenticated users to /auth
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Mosaic color="#2a9cef" size="large" text="Loading..." textColor="" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 pt-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Notes</h1>
      <NoteForm setQuery={setQuery} />
      <NoteTranscription />
      {isLoading ? (
        <div className="flex justify-center py-20">
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
    </div>
  );
}
