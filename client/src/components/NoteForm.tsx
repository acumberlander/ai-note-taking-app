"use client";

import { ChangeEvent, useState } from "react";
import { useNoteStore } from "@/store/useNoteStore";
import RefreshButton from "./RefreshButton";

type NoteFormProps = {
  setSearchQuery: (query: string) => void;
};

export default function NoteForm({ setSearchQuery }: NoteFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isFilter, setIsFilter] = useState(false);

  const { addNote, fetchNotes, updateAiResponse } = useNoteStore(
    (state) => state
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    await addNote({ title, content });
    setTitle("");
    setContent("");
    refreshNotes();
  };

  const refreshNotes = async () => {
    setSearchQuery("");
    updateAiResponse("");
    await fetchNotes();
  };

  return (
    <div>
      <div className="flex justify-between mb-2">
        <div className="flex mt-2">
          <button
            onClick={() => setIsFilter(false)}
            className={`px-4 py-1 rounded ${
              !isFilter ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Create
          </button>
          <button
            onClick={() => setIsFilter(true)}
            className={`px-4 py-1 rounded ${
              isFilter ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Filter
          </button>
        </div>
        <RefreshButton onClick={refreshNotes} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="note-form bg-gray-100 p-4 rounded-lg"
      >
        {isFilter ? (
          <input
            type="text"
            placeholder="Filter displayed notes"
            onChange={handleSearchChange}
            className="w-full p-2 mb-2 border rounded"
          />
        ) : (
          <>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 mb-2 border rounded"
            />
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 mb-2 border rounded"
            />
          </>
        )}
        {!isFilter ? (
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Add Note
          </button>
        ) : null}
      </form>
    </div>
  );
}
