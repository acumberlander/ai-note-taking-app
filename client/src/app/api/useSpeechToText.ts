import { useState, useRef } from "react";

export const useSpeechToText = () => {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setError(null);
    setText("");
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      setError(
        "Failed to access microphone. Please allow microphone permissions."
      );
    }
  };

  const stopRecording = async () => {
    if (!mediaRecorderRef.current) {
      setError("Recorder not initialized.");
      return;
    }

    setIsRecording(false);
    setIsTranscribing(true);
    mediaRecorderRef.current.stop();

    mediaRecorderRef.current.onstop = async () => {
      try {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const formData = new FormData();
        formData.append("audio", audioBlob, "audio.wav");

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await fetch(`${apiUrl}/transcribe`, {
          method: "POST",
          body: formData,
          credentials: "include",
          headers: {
            "X-Requested-With": "XMLHttpRequest",
          },
        });

        const data = await response.json();
        setText(data.text?.trim() || "search_all");

        if (!response.ok) {
          throw new Error(data.error || "Failed to transcribe audio.");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while transcribing.");
      } finally {
        setIsTranscribing(false);
      }
    };
  };

  const reset = () => {
    setText("");
  };

  return {
    text,
    isRecording,
    isTranscribing,
    startRecording,
    stopRecording,
    reset,
    error,
  };
};
