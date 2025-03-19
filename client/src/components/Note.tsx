// @ts-nocheck
import { useState } from "react";
import { Note as NoteType } from "@/types/note";
import { useNoteStore } from "@/store/useNoteStore";
import { FourSquare } from "react-loading-indicators";
import { useUserStore } from "@/store/useUserStore";
import { motion } from "framer-motion";
import { Typography } from "@material-tailwind/react";

interface NoteProps {
  note: NoteType;
  onViewNote: (note: NoteType) => void;
}

export default function Note({ note, onViewNote }: NoteProps) {
  const { updateNote, setNoteToDelete, setDeleteModalState } = useNoteStore();
  const { user } = useUserStore();
  const { id } = note;

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isSaving, setIsSaving] = useState(false);

  // Style to preserve whitespace and line breaks
  const preserveFormatStyle = {
    whiteSpace: "pre-line",
    wordBreak: "break-word" as const,
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;
    setIsSaving(true);
    const user_id = user?.id || null;

    await updateNote(id, { title, content, user_id });

    setIsSaving(false);
    setIsEditing(false);
  };

  const handleDeleteNote = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteModalState(true);
    setNoteToDelete(note);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleNoteClick = () => {
    if (!isEditing) {
      onViewNote(note);
    }
  };

  const handleWhileTap = () => {
    if (isEditing) {
      return { scale: 1 };
    } else {
      return { scale: 0.8 };
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={isEditing ? undefined : { scale: 0.9 }}
    >
      <div
        className="relative flex flex-col justify-between bg-white shadow-md rounded-xl p-4 h-64 overflow-hidden cursor-pointer"
        onClick={handleNoteClick}
      >
        {/* Saving Animation Overlay */}
        {isSaving && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10 pb-8">
            <FourSquare
              color="#249fe4"
              size="large"
              text="Saving..."
              textColor=""
            />
          </div>
        )}

        {isEditing ? (
          <>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded mb-2"
              onClick={(e) => e.stopPropagation()}
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded h-full"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex justify-evenly m-2 h-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave();
                }}
                className="bg-green-500 text-white px-4 py-1 rounded"
              >
                Save
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(false);
                }}
                className="bg-gray-500 text-white px-4 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-gray-900">
              {note?.title}
            </h2>
            {note?.content.length > 240 ? (
              <div className="overflow-y-hidden hover:overflow-y-auto hover:border-2 hover:border-blue-100">
                <div
                  className="text-gray-600 mt-2 max-h-28 markdown-content"
                  style={preserveFormatStyle}
                >
                  <Typography>{note?.content}</Typography>
                </div>
              </div>
            ) : (
              <div className="overflow-y-hidden hover:overflow-y-auto p-2">
                <div
                  className="text-gray-600 mt-2 max-h-28 markdown-content"
                  style={preserveFormatStyle}
                >
                  <Typography>{note?.content}</Typography>
                </div>
              </div>
            )}
            <div
              className="flex justify-evenly m-2 h-10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleDeleteNote}
                className="bg-red-500 text-white px-4 py-1 rounded flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5 mr-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
                Delete
              </button>
              <button
                onClick={handleEditClick}
                className="bg-blue-500 text-white px-4 py-1 rounded flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5 mr-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
                Edit
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
