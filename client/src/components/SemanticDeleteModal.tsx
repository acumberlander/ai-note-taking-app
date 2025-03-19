//@ts-nocheck
import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  Checkbox,
  Typography,
  DialogBody,
  DialogHeader,
  DialogFooter,
} from "@material-tailwind/react";
import { useNoteStore } from "@/store/useNoteStore";
import { Note } from "@/types/note";

export default function SemanticDeleteModal() {
  const {
    queriedNotes,
    queryIntent,
    semanticDeleteModalIsOpen,
    deleteNotes,
    setQueriedNotes,
    setSemanticDeleteModalState,
  } = useNoteStore();

  // Local state to track selected notes
  const [selectedNotes, setSelectedNotes] = useState([]);

  // When queriedNotes changes (or when modal opens), initialize selected notes
  useEffect(() => {
    if (queriedNotes && queriedNotes.length > 0) {
      // Create a new array with contentHidden set to true for all notes
      const notesWithHiddenContent = queriedNotes.map((note) => ({
        ...note,
        contentHidden: true,
      }));

      // Update the store with the new array
      setQueriedNotes(notesWithHiddenContent);

      // For delete_all intent, pre-select all notes
      if (queryIntent === "delete_all") {
        setSelectedNotes(notesWithHiddenContent);
      } else {
        // For other intents, start with no notes selected
        setSelectedNotes([]);
      }
    }
  }, [semanticDeleteModalIsOpen, queryIntent]);

  const handleModalState = (isOpen = false) => {
    setSemanticDeleteModalState(isOpen);
  };

  const handleCheckboxChange = (note: Note) => {
    if (selectedNotes.some((n) => n.id === note.id)) {
      setSelectedNotes(selectedNotes.filter((n) => n.id !== note.id));
    } else {
      setSelectedNotes([...selectedNotes, note]);
    }
  };

  const handleSelectAll = () => {
    if (queriedNotes && queriedNotes.length > 0) {
      if (selectedNotes.length === queriedNotes.length) {
        // If all are selected, deselect all
        setSelectedNotes([]);
      } else {
        // Otherwise, select all
        setSelectedNotes([...queriedNotes]);
      }
    }
  };

  const handleDelete = async () => {
    await deleteNotes(selectedNotes);
    handleModalState(false);
  };

  const handleHideContent = (noteId: number) => {
    if (!queriedNotes || queriedNotes.length === 0) return;

    // Create a new array with the updated note
    const updatedNotes = queriedNotes.map((note) => {
      if (note.id === noteId) {
        // Create a new note object with the contentHidden property toggled
        return {
          ...note,
          contentHidden:
            note.contentHidden === undefined ? false : !note.contentHidden,
        };
      }
      return note;
    });

    // Update both the store and the local state
    setQueriedNotes(updatedNotes);
    setSelectedNotes(
      selectedNotes.map((note) =>
        note.id === noteId
          ? {
              ...note,
              contentHidden:
                note.contentHidden === undefined ? false : !note.contentHidden,
            }
          : note
      )
    );
  };

  return (
    <Dialog
      size="xl"
      open={semanticDeleteModalIsOpen}
      handler={handleModalState}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-auto p-8">
        <DialogHeader className="relative p-6 flex flex-col">
          <Typography variant="h2" color="blue-gray" className="text-4xl">
            {queryIntent === "delete_all" ? "Delete All Notes" : "Delete Notes"}
          </Typography>
          <Typography className="mt-4 text-gray-600 text-2xl">
            {queryIntent === "delete_all"
              ? "You are about to delete all your notes. Please confirm your selection."
              : "Select the notes you wish to delete."}
          </Typography>
        </DialogHeader>
        <DialogBody className="px-6 py-4 max-h-96 overflow-y-auto">
          {!queryIntent.includes("delete_all") && (
            <div className="flex justify-end mb-4">
              <Button
                size="sm"
                variant={
                  selectedNotes.length === queriedNotes?.length
                    ? "outlined"
                    : "filled"
                }
                color="blue"
                onClick={handleSelectAll}
                className="text-sm"
              >
                {selectedNotes.length === queriedNotes?.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </div>
          )}
          <ul className="space-y-4">
            {queriedNotes?.map((note) => (
              <li key={note.id} className="flex flex-start py-3 px-4">
                <Checkbox
                  checked={selectedNotes.some((n) => n.id === note.id)}
                  onChange={() => handleCheckboxChange(note)}
                  containerProps={{ className: "mr-4 scale-150" }}
                />
                <div
                  onClick={() => handleHideContent(note.id)}
                  className="flex flex-col p-3 border-2 rounded shadow-md cursor-pointer w-full hover:bg-gray-50"
                >
                  <div className="flex">
                    <Typography
                      variant="subtitle1"
                      className="text-2xl font-bold"
                    >
                      {note.title}
                    </Typography>
                  </div>
                  {note?.contentHidden ? null : (
                    <div className="mt-3">
                      <Typography
                        variant="paragraph"
                        color="gray"
                        className="text-[1.75em] markdown-content"
                      >
                        {note.content}
                      </Typography>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </DialogBody>
        <DialogFooter className="flex justify-end space-x-4 p-6">
          <Button
            className="text-lg font-medium px-5 py-2.5 cursor-pointer"
            variant="outlined"
            color="gray"
            onClick={() => handleModalState(false)}
            size="lg"
          >
            Cancel
          </Button>
          <Button
            className="text-lg font-medium px-5 py-2.5 cursor-pointer text-white"
            variant="filled"
            color="red"
            onClick={handleDelete}
            size="lg"
            disabled={selectedNotes.length === 0}
          >
            {queryIntent === "delete_all"
              ? `Delete All Notes (${selectedNotes.length})`
              : `Delete Selected (${selectedNotes.length})`}
          </Button>
        </DialogFooter>
      </div>
    </Dialog>
  );
}
