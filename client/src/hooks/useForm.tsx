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

  const {
    addNote,
    fetchNotes,
    updateAiResponse,
    noteFormLoading,
    setNoteFormLoading,
  } = useNoteStore((state) => state);

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
    setNoteFormLoading(true);
    await addNote({ title, content });
    setNoteFormLoading(false);
    clearInputs();
    await refreshNotes();
  };

  const refreshNotes = async () => {
    setQuery("");
    clearInputs();
    updateAiResponse("");
    await fetchNotes();
  };

  const { text, isRecording } = useSpeechToText();

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
    noteFormLoading,
    setTitle,
    setContent,
    setIsFilter,
    handleSubmit,
    refreshNotes,
    handleSearchChange,
  };
};
