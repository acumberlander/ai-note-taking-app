//@ts-nocheck
import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  Checkbox,
  Typography,
  DialogBody,
  IconButton,
  DialogHeader,
  DialogFooter,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useNoteStore } from "@/store/useNoteStore";
import { Note } from "@/types/note";

export default function SemanticDeleteModal() {
  const {
    notesToDelete,
    semanticDeleteModalIsOpen,
    deleteNotes,
    setNotesToDelete,
    setSemanticDeleteModalState,
  } = useNoteStore();

  // Local state to track selected notes
  const [selectedNotes, setSelectedNotes] = useState([]);

  // When notesToDelete changes (or when modal opens), initialize selected notes
  useEffect(() => {
    if (notesToDelete && notesToDelete.length > 0) {
      // Create a new array with contentHidden set to true for all notes
      const notesWithHiddenContent = notesToDelete.map((note) => ({
        ...note,
        contentHidden: true,
      }));

      // Update the store with the new array
      setNotesToDelete(notesWithHiddenContent);
      setSelectedNotes(notesWithHiddenContent);
    }
  }, [semanticDeleteModalIsOpen]);

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

  const handleDelete = async () => {
    await deleteNotes(selectedNotes);
    handleModalState(false);
  };

  const handleHideContent = (noteId: number) => {
    if (!notesToDelete || notesToDelete.length === 0) return;

    // Create a new array with the updated note
    const updatedNotes = notesToDelete.map((note) => {
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
    setNotesToDelete(updatedNotes);
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
      open={semanticDeleteModalIsOpen}
      handler={handleModalState}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto p-6">
        <DialogHeader className="relative p-4 flex flex-col">
          <Typography variant="h4" color="blue-gray">
            Delete Notes
          </Typography>
          <Typography className="mt-2 text-gray-600">
            Select the notes you wish to delete.
          </Typography>
        </DialogHeader>
        <DialogBody className="px-4 py-1 max-h-80 overflow-y-auto">
          <ul className="space-y-1">
            {notesToDelete?.map((note) => (
              <li key={note.id} className="flex flex-start py-1 px-2">
                <Checkbox
                  checked={selectedNotes.some((n) => n.id === note.id)}
                  onChange={() => handleCheckboxChange(note)}
                  containerProps={{ className: "mr-2" }}
                />
                <div
                  onClick={() => handleHideContent(note.id)}
                  className="flex flex-col p-1.5 border rounded shadow-sm cursor-pointer w-full hover:bg-gray-50"
                >
                  <div className="flex">
                    <Typography
                      variant="subtitle1"
                      className="font-medium font-bold"
                    >
                      {note.title}
                    </Typography>
                  </div>
                  {note?.contentHidden ? null : (
                    <div className="mt-1">
                      <Typography variant="caption" color="gray">
                        {note.content}
                      </Typography>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </DialogBody>
        <DialogFooter className="flex justify-end space-x-2 p-4">
          <Button
            className="cursor-pointer p-2"
            variant="outlined"
            color="gray"
            onClick={() => handleModalState(false)}
          >
            Cancel
          </Button>
          <Button
            className="cursor-pointer p-2"
            variant="filled"
            color="red"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </DialogFooter>
      </div>
    </Dialog>
  );
}
