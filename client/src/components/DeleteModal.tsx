// @ts-nocheck
import React from "react";
import {
  Button,
  Dialog,
  Typography,
  DialogBody,
  IconButton,
  DialogHeader,
  DialogFooter,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Note } from "@/types/note";
import { useModal } from "@/hooks/hooks";
import { useNoteStore } from "@/store/useNoteStore";

export default function DeleteModal() {
  const {
    noteToDelete: note,
    deleteNote,
    deleteModalIsOpen,
    setDeleteModalState,
  } = useNoteStore();

  return (
    <Dialog
      size="sm"
      open={deleteModalIsOpen}
      handler={() => setDeleteModalState(false)}
      className="fixed inset-0 flex items-center justify-center p-4 text-center bg-black/50"
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <DialogHeader className="relative m-0 block">
          <Typography variant="h4" color="blue-gray">
            Are you sure you want to delete this note?
          </Typography>
          <IconButton
            size="sm"
            variant="text"
            className="!absolute right-3.5 top-3.5"
            onClick={() => setDeleteModalState(false)}
          >
            <XMarkIcon className="h-4 w-4 stroke-2 hover:bg-red-500 rounded" />
          </IconButton>
        </DialogHeader>
        <DialogBody className="space-y-4 px-2">
          <Typography>{note?.title}</Typography>
        </DialogBody>
        <DialogFooter className="flex justify-evenly">
          <Button
            className="bg-gray-500 px-4 py-1 rounded"
            onClick={() => setDeleteModalState(false)}
          >
            Cancel
          </Button>
          <Button
            className="bg-red-500 text-white px-4 py-1 rounded"
            onClick={() => deleteNote(note.id)}
          >
            Delete
          </Button>
        </DialogFooter>
      </div>
    </Dialog>
  );
}
