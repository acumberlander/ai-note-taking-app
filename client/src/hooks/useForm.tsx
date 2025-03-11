import { ChangeEvent, useState, useEffect } from "react";
import { useNoteStore } from "@/store/useNoteStore";
import { useSpeechToText } from "@/app/api/useSpeechToText";

interface UseFormProps {
  setQuery: (query: string) => void;
}

export const useForm = ({ setQuery }: UseFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [filter, setFilter] = useState("");
  const [isFilter, setIsFilter] = useState(false);
 // const [isRecording, setIsRecording] = useState(false); // State for recording status



  const { addNote, fetchNotes, updateAiResponse } = useNoteStore(
    (state) => state
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
    setQuery(e.target.value);
  };

  const clearInputs = () => {
    setTitle("");
    setContent("");
    setFilter("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    await addNote({ title, content });
    clearInputs();
    refreshNotes();
  };

  const refreshNotes = async () => {
    setQuery("");
    clearInputs();
    updateAiResponse("");
    await fetchNotes();
  };

  const { text, startRecording, stopRecording, isRecording } = useSpeechToText();

   // Function to start recording and set the content from speech
   //const handleMicrophoneClick = async () => {
    const handleMicrophoneClick = () => {
      if (isRecording) {
        stopRecording(); // ✅ Correctly stop recording
      } else {
        startRecording(); // ✅ Correctly start recording
      }
    };


  useEffect(() => {
    if (!isRecording && text) {
      setContent(text);
    }
  }, [text, isRecording]);

  return {
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
    handleMicrophoneClick,
  };
};
