import { ChangeEvent, useState, useEffect } from "react";
import { useNoteStore } from "@/store/useNoteStore";
import { useSpeechToText } from "@/app/api/useSpeechToText";
import { useUserStore } from "@/store/useUserStore";
import { _createNote } from "@/app/api/postgresRequests";

interface UseFormProps {
  setQuery: (query: string) => void;
}

export const useForm = ({ setQuery }: UseFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [filter, setFilter] = useState("");
  const [isFilter, setIsFilter] = useState(false);

  const { fetchNotes, updateAiResponse, noteFormLoading, setNoteFormLoading } =
    useNoteStore();
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
    setNoteFormLoading(true);
    await _createNote({ title, content, user_id: user?.id || null });
    setNoteFormLoading(false);
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
    noteFormLoading,
    setTitle,
    setContent,
    setIsFilter,
    handleSubmit,
    refreshNotes,
    handleSearchChange,
  };
};
