"use client";

import RefreshButton from "./RefreshButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { useSpeechToText } from "@/app/api/useSpeechToText";
import { useForm } from "@/hooks/useForm";

type NoteFormProps = {
  setSearchQuery: (query: string) => void;
};

export default function NoteForm({ setSearchQuery }: NoteFormProps) {
  const {
    title,
    filter,
    content,
    isFilter,
    isRecording,
    setTitle,
    setContent,
    setIsFilter,
    handleSubmit,
    refreshNotes,
    handleSearchChange,
  } = useForm({ setSearchQuery });

  const { startRecording, stopRecording } = useSpeechToText();

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
        {!isFilter ? (
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded"
            >
              Add Note
            </button>
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-3 rounded-full ${
                isRecording ? "bg-red-500" : "bg-gray-300"
              } text-white`}
            >
              <FontAwesomeIcon
                icon={faMicrophone}
                className="text-black w-6 h-6"
              />
            </button>
          </div>
        ) : null}
      </form>
    </div>
  );
}
