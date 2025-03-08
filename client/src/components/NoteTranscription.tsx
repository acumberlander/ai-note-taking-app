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
  const { aiResponse, updateAiResponse } = useNoteStore((state) => state);

  const handleStartRecording = () => {
    reset();
    updateAiResponse("");
    startRecording();
  };

  const handleStopRecording = () => {
    updateAiResponse("Searching...");
    stopRecording();
  };

  useEffect(() => {
    if (text && !isRecording && !isTranscribing) {
      semanticSearchNotes(text);
    }
  }, [text, isRecording, isTranscribing, semanticSearchNotes]);

  return (
    <div className="mt-4 p-4 bg-white shadow-md rounded-lg">
      <button
        onMouseDown={handleStartRecording}
        onMouseUp={handleStopRecording}
        disabled={isTranscribing}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
      >
        {isRecording ? "Recording..." : "Hold to Speak"}
      </button>

      {isTranscribing && <p className="mt-2 text-gray-500">Transcribing...</p>}
      {error && <p className="mt-2 text-red-500">{error}</p>}
      {aiResponse && <p className="mt-4 font-semibold">{aiResponse}</p>}
    </div>
  );
}
