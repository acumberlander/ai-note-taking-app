// @ts-nocheck
import React from "react";
import {
  Button,
  Dialog,
  Typography,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
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
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-10">
        <DialogHeader className="relative m-0 block">
          <Typography variant="h3" color="blue-gray">
            Are you sure you want to delete this note?
          </Typography>
        </DialogHeader>
        <DialogBody className="space-y-6 px-2">
          <Typography className="font-bold text-xl">{note?.title}</Typography>
          {note?.content.length > 240 ? (
            <div className="overflow-y-hidden hover:overflow-y-auto hover:border-2 hover:border-blue-100">
              <div className="text-gray-600 mt-2 max-h-40 p-4">
                <Typography
                  style={{ fontSize: "1.75em", lineHeight: "normal" }}
                  className="markdown-content"
                >
                  {note?.content}
                </Typography>
              </div>
            </div>
          ) : (
            <div className="overflow-y-hidden hover:overflow-y-auto p-4">
              <div className="text-gray-600 mt-2 max-h-40">
                <Typography
                  style={{ fontSize: "1.75em", lineHeight: "normal" }}
                  className="markdown-content"
                >
                  {note?.content}
                </Typography>
              </div>
            </div>
          )}
        </DialogBody>
        <DialogFooter className="flex justify-evenly mt-6">
          <Button
            className="text-lg font-medium px-6 py-3 text-white bg-gray-500"
            onClick={handleCloseModal}
          >
            Cancel
          </Button>
          <Button
            className="text-lg font-medium px-6 py-3 text-white bg-red-500"
            onClick={() => deleteNote(note.id)}
          >
            Delete
          </Button>
        </DialogFooter>
      </div>
    </Dialog>
  );
}
