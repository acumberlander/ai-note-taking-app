import { useState, useEffect } from "react";
import { useNoteStore } from "@/store/useNoteStore";
import { useUserStore } from "@/store/useUserStore";

const useNotes = () => {
  const [query, setQuery] = useState("");
  const { allNotes, fetchNotes } = useNoteStore();
  const { user } = useUserStore();
  const [filteredNotes, setFilteredNotes] = useState(allNotes);

  useEffect(() => {
    if (user) {
      const { id } = user;
      fetchNotes(id);
    }
  }, [fetchNotes]);

  useEffect(() => {
    if (query.trim() === "") {
      setFilteredNotes(allNotes);
    } else {
      const lowerQuery = query.toLowerCase();
      const filtered = allNotes.filter(
        (note) =>
          note.title.toLowerCase().includes(lowerQuery) ||
          note.content.toLowerCase().includes(lowerQuery)
      );
      setFilteredNotes(filtered);
    }
  }, [query, allNotes]);

  return {
    query,
    setQuery,
    filteredNotes,
  };
};

export default useNotes;
