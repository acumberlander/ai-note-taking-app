"use client";

import React from "react";
import Note from "@/components/Note";
import { Note as NoteType } from "@/types/note";

type NoteListProps = {
  query: string;
  notes: NoteType[];
};

export default function NoteList({ query, notes }: NoteListProps) {
  return (
    <div>
      {notes.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {notes.map((note) => (
            <Note key={note.id} note={note} />
          ))}
        </div>
      ) : (
        <div className="font-bold mt-4">
          There are not notes that match these keywords:{" "}
          <p className="font-bold text-red-600">{query}</p>
        </div>
      )}
    </div>
  );
}
