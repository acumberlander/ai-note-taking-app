"use client";

import { useEffect } from "react";
import { useNoteStore } from "@/store/useNoteStore";

export default function NoteList() {
  const { notes, fetchNotes, deleteNote } = useNoteStore();

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return (
    <div>
      {notes.map((note) => (
        <div key={note.id} className="p-4 border rounded mb-2">
          <h2 className="text-xl font-bold">{note.title}</h2>
          <p>{note.content}</p>
          <button
            onClick={() => deleteNote(note.id)}
            className="mt-2 bg-red-500 text-white px-4 py-1 rounded"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
