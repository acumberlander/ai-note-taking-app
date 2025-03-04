import { useSpeechToText } from "@/app/api/useSpeechToText";
import { useNoteStore } from "@/store/useNoteStore";
import { useEffect, useState } from "react";

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
  const [aiMessage, setAiMessage] = useState<string>("");

  const handleStopRecording = (): void => {
    stopRecording();
    setAiMessage("Searching...");
  };

  useEffect(() => {
    if (text && !isRecording && !isTranscribing) {
      semanticSearchNotes(text).then(({ message }) => {
        setAiMessage(message);
      });
    }
  }, [text, isRecording, isTranscribing, semanticSearchNotes]);

  return (
    <div className="mt-4 p-4 bg-white shadow-md rounded-lg">
      <button
        onMouseDown={() => {
          reset();
          setAiMessage("I'm listening...");
          startRecording();
        }}
        onMouseUp={handleStopRecording}
        disabled={isTranscribing}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
      >
        {isRecording ? "Recording..." : "Hold to Speak"}
      </button>

      {isTranscribing && <p className="mt-2 text-gray-500">Transcribing...</p>}
      {error && <p className="mt-2 text-red-500">{error}</p>}

      {aiMessage && <p className="mt-4 font-semibold">{aiMessage}</p>}
    </div>
  );
}
