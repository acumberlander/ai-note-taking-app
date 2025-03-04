import { useSpeechToText } from "@/app/api/useSpeechToText";
import { useNoteStore } from "@/store/useNoteStore";
import { useEffect } from "react";

export default function NoteTranscription() {
  const {
    text,
    isRecording,
    isTranscribing,
    startRecording,
    stopRecording,
    reset,
    error,
  } = useSpeechToText();
  const semanticSearchNotes = useNoteStore(
    (state) => state.semanticSearchNotes
  );

  useEffect(() => {
    if (text) {
      semanticSearchNotes(text).then(() => {
        reset();
      });
    }
  }, [text, semanticSearchNotes, reset]);

  return (
    <div className="mt-4 p-4 bg-white shadow-md rounded-lg">
      <button
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        disabled={isTranscribing}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isRecording ? "Recording..." : "Hold to Speak"}
      </button>

      {isTranscribing && <p className="mt-2 text-gray-500">Transcribing...</p>}
      {error && <p className="mt-2 text-red-500">{error}</p>}

      <p className="mt-4 p-2 border rounded bg-gray-100">
        {text || "Your transcribed text will appear here..."}
      </p>
    </div>
  );
}
