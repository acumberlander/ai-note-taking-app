import { useEffect } from "react";
import { useSpeechToText } from "@/app/api/useSpeechToText";
import { useNoteStore } from "@/store/useNoteStore";

const useNoteTranscription = () => {
  const {
    text,
    error,
    isRecording,
    isTranscribing,
    reset,
    stopRecording,
    startRecording,
  } = useSpeechToText();

  const { aiResponse, updateAiResponse, queryIntent, semanticQuery } =
    useNoteStore((state) => state);

  const handleStartRecording = () => {
    reset();
    updateAiResponse("I'm listening...");
    startRecording();
  };

  const handleStopRecording = () => {
    updateAiResponse("");
    stopRecording();
  };

  useEffect(() => {
    if (text && !isRecording && !isTranscribing) {
      semanticQuery(text);
    }
  }, [text, isRecording, isTranscribing, semanticQuery]);

  return {
    error,
    aiResponse,
    isRecording,
    isTranscribing,
    reset,
    stopRecording,
    startRecording,
    handleStartRecording,
    handleStopRecording,
  };
};

export default useNoteTranscription;
