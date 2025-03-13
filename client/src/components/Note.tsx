import { useState } from "react";
import { Note as NoteType } from "@/types/note";
import { useNoteStore } from "@/store/useNoteStore";
import { FourSquare } from "react-loading-indicators";

interface NoteProps {
  note: NoteType;
}

export default function Note({ note }: NoteProps) {
  const { updateNote, setNoteToDelete, setDeleteModalState } = useNoteStore();
  const { id } = note;

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;
    setIsSaving(true);

    await updateNote(id, { title, content });

    setIsSaving(false);
    setIsEditing(false);
  };

  const handleDeleteNote = () => {
    setDeleteModalState(true);
    setNoteToDelete(note);
  };

  return (
    <div className="relative flex flex-col justify-between bg-white shadow-md rounded-xl p-4 h-64 overflow-hidden">
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
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded h-full"
          />
          <div className="flex justify-evenly m-2 h-10">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-1 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-4 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-lg font-semibold text-gray-900">{note.title}</h2>
          {note.content.length > 240 ? (
            <div className="overflow-y-hidden hover:overflow-y-auto hover:border-2 hover:border-blue-100">
              <p className="text-gray-600 mt-2 max-h-28 p-2">{note.content}</p>
            </div>
          ) : (
            <div className="overflow-y-hidden hover:overflow-y-auto p-2">
              <p className="text-gray-600 mt-2 max-h-28">{note.content}</p>
            </div>
          )}
          <div className="flex justify-evenly m-2 h-10">
            <button
              onClick={handleDeleteNote}
              className="bg-red-500 text-white px-4 py-1 rounded"
            >
              Delete
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-1 rounded"
            >
              Edit
            </button>
          </div>
        </>
      )}
    </div>
  );
}
