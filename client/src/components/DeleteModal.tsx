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
import { useModal } from "@/hooks/useModal";
import { useNoteStore } from "@/store/useNoteStore";

export default function DeleteModal() {
  const {
    noteToDelete: note,
    deleteNote,
    deleteModalIsOpen,
    setDeleteModalState,
  } = useNoteStore();

  const handleCloseModal = () => {
    setDeleteModalState(false);
  };

  return (
    <Dialog
      size="xl"
      open={deleteModalIsOpen}
      handler={handleCloseModal}
      className="fixed inset-0 flex items-center justify-center p-4 text-center bg-black/50"
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-8">
        <DialogHeader className="relative m-0 block">
          <Typography variant="h4" color="blue-gray">
            Are you sure you want to delete this note?
          </Typography>
        </DialogHeader>
        <DialogBody className="space-y-4 px-2">
          <Typography className="font-bold">{note?.title}</Typography>
          {note?.content.length > 240 ? (
            <div className="overflow-y-hidden hover:overflow-y-auto hover:border-2 hover:border-blue-100">
              <Typography className="text-gray-600 mt-2 max-h-28 p-2">
                {note?.content}
              </Typography>
            </div>
          ) : (
            <div className="overflow-y-hidden hover:overflow-y-auto p-2">
              <Typography className="text-gray-600 mt-2 max-h-28">
                {note?.content}
              </Typography>
            </div>
          )}
        </DialogBody>
        <DialogFooter className="flex justify-evenly">
          <Button
            className="bg-gray-500 px-4 py-1 rounded"
            onClick={handleCloseModal}
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
