//@ts-nocheck

"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Note from "@/components/Note";
import NoteViewModal from "@/components/NoteViewModal";
import { Note as NoteType, NewNote } from "@/types/note";
import { useNoteStore } from "@/store/useNoteStore";
import { useUserStore } from "@/store/useUserStore";
import { Dialog, DialogHeader, DialogBody } from "@material-tailwind/react";
import { _fetchAllNotes } from "@/app/api/postgresRequests";
import { Typography } from "@material-tailwind/react";

type NoteListProps = {
  query: string;
  notes: NoteType[];
  createTestNotes: () => Promise<void>;
};

export default function NoteList({
  query,
  notes,
  createTestNotes,
}: NoteListProps) {
  const { user } = useUserStore();

  // State for the note view modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);

  const handleViewNote = (note: NoteType) => {
    const index = notes.findIndex((n) => n.id === note.id);
    if (index !== -1) {
      setCurrentNoteIndex(index);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleNavigate = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentNoteIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : notes.length - 1
      );
    } else {
      setCurrentNoteIndex((prevIndex) =>
        prevIndex < notes.length - 1 ? prevIndex + 1 : 0
      );
    }
  };

  return (
    <div>
      {notes?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {notes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, rotateX: -90 }}
              animate={{ opacity: 1, rotateX: 0 }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: index * 0.1,
              }}
            >
              <Note
                className="note-card"
                note={note}
                onViewNote={handleViewNote}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-8">
          <Typography
            style={{ fontSize: "1.75em", lineHeight: "normal", color: "black" }}
          >
            No notes found.
          </Typography>
          <Typography
            style={{ fontSize: "1.75em", lineHeight: "normal", color: "black" }}
            className="mt-2 mb-4"
          >
            Get started by creating your own notes above or click the button
            below to generate some sample notes.
          </Typography>
          <button
            onClick={createTestNotes}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Create Test Notes
          </button>
        </div>
      )}

      {/* Note View Modal */}
      <NoteViewModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        currentNote={notes[currentNoteIndex]}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
