// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  Typography,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import { useNoteStore } from "@/store/useNoteStore";
import { FourSquare } from "react-loading-indicators";

export default function DeleteModal() {
  const {
    noteToDelete: note,
    deleteNote,
    deleteModalIsOpen,
    setDeleteModalState,
    setNoteToDelete,
  } = useNoteStore();
  const [isDeleting, setIsDeleting] = useState(false);

  // Reset isDeleting when modal opens/closes
  useEffect(() => {
    if (!deleteModalIsOpen) {
      setIsDeleting(false);
    }
  }, [deleteModalIsOpen]);

  const handleCloseModal = () => {
    setIsDeleting(false);
    setDeleteModalState(false);
    setNoteToDelete(undefined);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    if (!note || !note.id) {
      setIsDeleting(false);
      console.error("No note to delete");
      handleCloseModal();
      return;
    }

    try {
      const success = await deleteNote(note.id);
      if (success) {
        setIsDeleting(false);
        handleCloseModal();
      } else {
        console.error("Delete operation returned false");
        setIsDeleting(false);
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      handleCloseModal();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog
      size="xl"
      open={deleteModalIsOpen}
      handler={handleCloseModal}
      className="fixed inset-0 flex items-center justify-center p-4 text-center bg-black/50"
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-10 relative">
        {/* Deleting Animation Overlay */}
        {isDeleting && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10 rounded-lg">
            <FourSquare
              color="#f44336"
              size="large"
              text="Deleting..."
              textColor=""
            />
          </div>
        )}

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
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            className="text-lg font-medium px-6 py-3 text-white bg-red-500"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            Delete
          </Button>
        </DialogFooter>
      </div>
    </Dialog>
  );
}
