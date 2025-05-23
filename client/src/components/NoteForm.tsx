"use client";

import RefreshButton from "./RefreshButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { useSpeechToText } from "@/app/api/useSpeechToText";
import { FourSquare } from "react-loading-indicators";
import { useForm } from "@/hooks/useForm";
import { useEffect } from "react";

type NoteFormProps = {
  setQuery: (query: string) => void;
};

export default function NoteForm({ setQuery }: NoteFormProps) {
  const {
    title,
    filter,
    content,
    isFilter,
    noteFormLoading,
    setTitle,
    setContent,
    setIsFilter,
    handleSubmit,
    refreshNotes,
    handleSearchChange,
  } = useForm({ setQuery });

  // Get the complete speech-to-text hook functionality
  const {
    startRecording,
    stopRecording,
    isRecording: micIsRecording,
    isTranscribing,
    text,
  } = useSpeechToText();

  // Check if form is valid (both title and content have values)
  const isFormValid = title.trim() !== "" && content.trim() !== "";

  // Handle recording toggle
  const toggleRecording = () => {
    if (micIsRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Update content when speech recognition completes
  useEffect(() => {
    if (text && !micIsRecording && !isTranscribing) {
      setContent(text);
    }
  }, [text, micIsRecording, isTranscribing, setContent]);

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
        className="note-form bg-gray-100 p-4 rounded-lg relative"
      >
        {noteFormLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10 pb-8 rounded">
            <FourSquare
              color="#249fe4"
              size="large"
              text="Adding Note..."
              textColor=""
            />
          </div>
        )}
        {isFilter ? (
          <input
            type="text"
            placeholder="Filter displayed notes"
            onChange={handleSearchChange}
            value={filter}
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
        {!isFilter && (
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className={`w-full p-2 rounded ${
                isFormValid
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-500"
              }`}
              disabled={!isFormValid || noteFormLoading || isTranscribing}
            >
              Add Note
            </button>
            <button
              type="button"
              onClick={toggleRecording}
              className={`p-3 rounded-full ${
                micIsRecording ? "bg-red-500" : "bg-gray-300"
              } text-white`}
              disabled={isTranscribing || noteFormLoading}
            >
              <FontAwesomeIcon
                icon={faMicrophone}
                className="text-black w-6 h-6"
              />
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
