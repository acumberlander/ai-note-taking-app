"use client";

import { ChangeEvent, useState, useCallback } from "react";
import { useNoteStore } from "@/store/useNoteStore";
import { debounce } from "@/utils/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { useSpeechToText } from "@/app/api/useSpeechToText"; // Assuming you have a speech-to-text function
import { useEffect } from "react";

export default function NoteForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [query, setQuery] = useState("");
  //const [isRecording, setIsRecording] = useState(false); // State for recording status

  const addNote = useNoteStore((state) => state.addNote);
  const searchNotes = useNoteStore((state) => state.searchNotes);


  // Use the speech-to-text hook
  const {
    text,
    isRecording,
    startRecording,
    stopRecording,
    error,
  } = useSpeechToText();

  // Automatically update content when transcription completes
  useEffect(() => {
    if (!isRecording && text) {
      setContent(text);
    }
  }, [text, isRecording]);



  const fetchNotes = async (searchQuery: string) => {
    if (!searchQuery) {
      await searchNotes("");
    } else {
      await searchNotes(searchQuery);
    }
  };

  const debouncedFetchNotes = useCallback(debounce(fetchNotes, 500), []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedFetchNotes(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSearch) {
      await fetchNotes(query);
    } else {
      if (!title || !content) return;
      await addNote({ title, content });
      setTitle("");
      setContent("");
    }
  };
  
  return (
    <div>
      <div className="flex mt-2">
        <button
          onClick={() => setIsSearch(false)}
          className={`px-4 py-1 rounded ${
            !isSearch ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Create
        </button>
        <button
          onClick={() => setIsSearch(true)}
          className={`px-4 py-1 rounded ${
            isSearch ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Search
        </button>
      </div>
      <form
        onSubmit={handleSubmit}
        className="note-form bg-gray-100 p-4 rounded-lg"
      >
        {isSearch ? (
          <input
            type="text"
            placeholder="Search for note"
            value={query}
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
        <div className="flex items-center gap-2">
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          {isSearch ? "Search" : "Add Note"}
          </button>
          {/* Microphone Button */}
         <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-3 rounded-full ${
                  isRecording ? "bg-red-500" : "bg-gray-300"
                } text-white`}
              >
                <FontAwesomeIcon icon={faMicrophone} className="text-black w-6 h-6" />
            </button>
              </div>
              {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}
