import { useEffect, useRef } from "react";
import { useSpeechToText } from "@/app/api/useSpeechToText";
import { useNoteStore } from "@/store/useNoteStore";
import { aiLoadingResponses } from "@/constants";

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
    updateAiResponse("");
    startRecording();
  };

  const handleStopRecording = () => {
    updateAiResponse(aiLoadingResponses[0]);
    stopRecording();
  };

  useEffect(() => {
    if (text && !isRecording && !isTranscribing) {
      semanticQuery(text);
    }
  }, [text, isRecording, isTranscribing, semanticQuery, queryIntent]);

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
