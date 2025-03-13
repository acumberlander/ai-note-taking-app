"use client";

import React from "react";
import { motion } from "framer-motion";
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
          {notes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, rotateX: -90 }}
              animate={{ opacity: 1, rotateX: 0 }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: index * 0.1, // Stagger effect
              }}
            >
              <Note note={note} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="font-bold mt-4">
          There are no notes that match these keywords:{" "}
          <p className="font-bold text-red-600">{query}</p>
        </div>
      )}
    </div>
  );
}
