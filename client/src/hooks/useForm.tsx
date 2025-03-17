import { ChangeEvent, useState, useEffect } from "react";
import { useNoteStore } from "@/store/useNoteStore";
import { useSpeechToText } from "@/app/api/useSpeechToText";
import { useUserStore } from "@/store/useUserStore";

interface UseFormProps {
  setQuery: (query: string) => void;
}

export const useForm = ({ setQuery }: UseFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [filter, setFilter] = useState("");
  const [isFilter, setIsFilter] = useState(false);

  const { addNote, fetchNotes, updateAiResponse } = useNoteStore();
  const { user } = useUserStore();

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
    await addNote({ title, content, user_id: user?.id || null });
    clearInputs();
    await refreshNotes();
  };

  const refreshNotes = async () => {
    setQuery("");
    clearInputs();
    updateAiResponse("");
    if (user) {
      await fetchNotes(user.id);
    }
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
    setTitle,
    setContent,
    setIsFilter,
    handleSubmit,
    refreshNotes,
    handleSearchChange,
  };
};
