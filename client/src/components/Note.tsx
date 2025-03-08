import { useState } from "react";
import { Note as NoteType } from "@/types/note";
import { useNoteStore } from "@/store/useNoteStore";

interface NoteProps {
  note: NoteType;
}

export default function Note({ note }: NoteProps) {
  const { updateNote, setNoteToDelete, setDeleteModalState } = useNoteStore();
  const { id } = note;

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;

    await updateNote(id, { title, content });
    setIsEditing(false);
  };

  const handleDeleteNote = () => {
    setDeleteModalState(true);
    setNoteToDelete(note);
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-4 border border-gray-200">
      {isEditing ? (
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <div className="flex justify-evenly mt-2">
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
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{note.title}</h2>
          <p className="text-gray-600 mt-2">{note.content}</p>
          <div className="flex justify-evenly mt-2">
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
        </div>
      )}
    </div>
  );
}
