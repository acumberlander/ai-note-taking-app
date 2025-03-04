import { useState, useRef } from "react";

// Custom hook to handle speech-to-text
export const useSpeechToText = () => {
  const [text, setText] = useState(""); // Transcribed text
  const [isRecording, setIsRecording] = useState(false); // Is recording or not
  const [isTranscribing, setIsTranscribing] = useState(false); // Is transcribing or not
  const [error, setError] = useState<string | null>(null); // Error message if any

  const mediaRecorderRef = useRef<MediaRecorder | null>(null); // Ref to store the MediaRecorder instance
  const audioChunksRef = useRef<Blob[]>([]); // Store the audio chunks

  // Start recording function
  const startRecording = async () => {
    setError(null);
    setText("");
    audioChunksRef.current = [];

    try {
      // Get audio stream from the user's microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Create a new MediaRecorder instance
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      // When audio data is available, push it to the audioChunksRef array
      recorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      // Start recording
      recorder.start();
      setIsRecording(true); // Set the recording state to true
    } catch (err) {
      setError(
        "Failed to access microphone. Please allow microphone permissions."
      );
    }
  };

  // Stop recording function
  const stopRecording = async () => {
    if (!mediaRecorderRef.current) {
      setError("Recorder not initialized.");
      return;
    }

    setIsRecording(false);
    setIsTranscribing(true);

    // Stop the recording and handle the audio data
    mediaRecorderRef.current.stop();

    mediaRecorderRef.current.onstop = async () => {
      try {
        // Create a Blob from the audio chunks and create a FormData to send to the server
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const formData = new FormData();
        formData.append("audio", audioBlob, "audio.wav");

        // Send the audio to your server for transcription
        const response = await fetch("http://localhost:5000/api/transcribe", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        console.log("Transcription received in frontend:", data);

        // Handle response from server
        if (!response.ok) {
          console.error("Transcription failed:", data);
          throw new Error(data.error || "Failed to transcribe audio.");
        }

        setText(data.text || "Transcription failed.");
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

  // Return values and functions to the component using this hook
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
