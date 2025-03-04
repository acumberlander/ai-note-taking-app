"use client";

import { useEffect } from "react";
import { useNoteStore } from "@/store/useNoteStore";
import Note from "@/components/Note";

export default function NoteList() {
  const { notes, fetchNotes } = useNoteStore();

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {(notes ?? []).map((note) => (
        <Note key={note.id} note={note} />
      ))}
    </div>
  );
}
