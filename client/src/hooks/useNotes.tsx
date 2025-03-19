import { useState, useEffect, useRef } from "react";
import { useNoteStore } from "@/store/useNoteStore";
import { useUserStore } from "@/store/useUserStore";
import { testNoteGroups } from "@/constants";
import { _createNote } from "@/app/api/postgresRequests";

const useNotes = () => {
  const [query, setQuery] = useState("");
  const { allNotes, fetchNotes, setNoteListLoading } = useNoteStore();
  const { user } = useUserStore();
  const [filteredNotes, setFilteredNotes] = useState(allNotes);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (user && !fetchedRef.current) {
      fetchedRef.current = true;
      fetchNotes(user.id);
    }
  }, [user]);

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

  const createTestNotes = async () => {
    if (!user) return;

    setNoteListLoading(true);

    try {
      // Create notes directly in the database
      const createdNotes = await Promise.all(
        testNoteGroups.map(async (noteData) => {
          const dbNote = await _createNote({
            title: noteData.title,
            content: noteData.content,
            user_id: user.id,
          });

          return dbNote;
        })
      );

      // Fetch all notes to ensure state is consistent
      await fetchNotes(user.id);
    } catch (error) {
      console.error("Error creating test notes:", error);
      setNoteListLoading(false);
    }
  };

  return {
    query,
    setQuery,
    filteredNotes,
    fetchNotes,
    createTestNotes,
  };
};

export default useNotes;
