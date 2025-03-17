//@ts-nocheck

"use client";

import React from "react";
import { motion } from "framer-motion";
import Note from "@/components/Note";
import { Note as NoteType, NewNote } from "@/types/note";
import { useNoteStore } from "@/store/useNoteStore";
// import { useUserStore } from "@/store/useUserStore";
import { Dialog, DialogHeader, DialogBody } from "@material-tailwind/react";

type NoteListProps = {
  query: string;
  notes: NoteType[];
};

export default function NoteList({ query, notes }: NoteListProps) {
  const { addNote } = useNoteStore();
  // const { user } = useUserStore();

  const createTestNotes = async () => {
    // if (!user) return;
    return;

    // Define 5 topic groups, each with 2 related notes
    const testNoteGroups = [
      // Group 1: Programming
      [
        {
          title: "JavaScript Basics",
          content:
            "Variables, functions, and control flow in JavaScript. Remember to use const for constants and let for variables that change.",
        },
        {
          title: "React Hooks Guide",
          content:
            "Using useState, useEffect, and custom hooks in React applications. Hooks should always be called at the top level of your components.",
        },
      ],
      // Group 2: Productivity
      [
        {
          title: "Time Management Tips",
          content:
            "Pomodoro technique: Work for 25 minutes, then take a 5-minute break. After 4 pomodoros, take a longer 15-30 minute break.",
        },
        {
          title: "Task Prioritization Framework",
          content:
            "Use the Eisenhower Matrix to categorize tasks by urgency and importance. Focus on important/urgent tasks first.",
        },
      ],
      // Group 3: Health
      [
        {
          title: "Morning Workout Routine",
          content:
            "10 minutes of stretching, 15 push-ups, 20 squats, and 30 seconds of plank. Great way to start the day with energy!",
        },
        {
          title: "Healthy Meal Prep Ideas",
          content:
            "Prepare vegetables and proteins in advance. Consider making overnight oats for breakfast and grain bowls for lunch.",
        },
      ],
      // Group 4: Learning
      [
        {
          title: "Book Recommendations",
          content:
            "Atomic Habits by James Clear, Deep Work by Cal Newport, and The Pragmatic Programmer for software developers.",
        },
        {
          title: "Learning Techniques",
          content:
            "Spaced repetition and active recall are proven methods to improve long-term retention of information.",
        },
      ],
      // Group 5: Project Ideas
      [
        {
          title: "App Development Concepts",
          content:
            "A language learning app with spaced repetition or a habit tracker with visualization of progress over time.",
        },
        {
          title: "Side Project Checklist",
          content:
            "Define clear objectives, set a realistic timeline, choose the right tech stack, and build an MVP before adding features.",
        },
      ],
    ];

    // Add all test notes
    for (const group of testNoteGroups) {
      for (const noteData of group) {
        const newNote: NewNote = {
          title: noteData.title,
          content: noteData.content,
          user_id: user?.id,
        };
        await addNote(newNote);
      }
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
                delay: index * 0.1, // Stagger effect
              }}
            >
              <Note note={note} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center mt-8">
          <div className="font-bold mb-6">
            {query ? (
              <>
                There are no notes that match these keywords:{" "}
                <p className="font-bold text-red-600">{query}</p>
              </>
            ) : (
              <div className="flex flex-col justify-center text-center">
                <h1>
                  You don't have any notes yet. Create your first note above!
                </h1>
                <h3>OR</h3>
                <h1>
                  Click the button below to add 10 default notes to quickly test
                  the app features!
                </h1>
              </div>
            )}
          </div>

          {!query && (
            <button
              onClick={createTestNotes}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Add Test Notes (for demo purposes)
            </button>
          )}
        </div>
      )}
    </div>
  );
}
