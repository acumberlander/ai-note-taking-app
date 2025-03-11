"use client";

import { useEffect, useState } from "react";
import { useNoteStore } from "@/store/useNoteStore";
import Note from "@/components/Note";

type NoteListProps = {
  query: string;
};

export default function NoteList({ query }: NoteListProps) {
  const { allNotes, fetchNotes } = useNoteStore();
  const [filteredNotes, setFilteredNotes] = useState(allNotes);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    if (query.trim() === "") {
      setFilteredNotes(allNotes);
    } else {
      const lowerQuery = query.toLowerCase();
      const filtered = allNotes.filter(
        (note) =>
          note.title.toLowerCase().includes(lowerQuery) ||
          note.content.toLowerCase().includes(lowerQuery)
      );
      setFilteredNotes(filtered);
    }
  }, [query, allNotes]);

  return (
    <div>
      {filteredNotes.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {filteredNotes.map((note) => (
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
