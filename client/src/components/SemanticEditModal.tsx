//@ts-nocheck
import React, { useEffect, useState } from "react";
import { Note } from "@/types/note";
import { useNoteStore } from "@/store/useNoteStore";
import {
  Button,
  Dialog,
  Typography,
  DialogBody,
  DialogHeader,
  DialogFooter,
  Textarea,
} from "@material-tailwind/react";
import { useModal } from "@/hooks/useModal";
import { useForm } from "@/hooks/useForm";
import { FourSquare } from "react-loading-indicators";
import { div } from "framer-motion/client";

const SemanticEditModal = ({ refreshNotes }) => {
  const {
    semanticEditModalIsOpen,
    setSemanticEditModalState,
    queriedNotes,
    editedNotes,
    setEditedNotes,
    updateNotes,
    updateAiResponse,
    setQueryIntent,
  } = useNoteStore();
  const { isSaving, setIsSaving } = useModal();
  const [savingError, setSavingError] = useState("");

  const handleNoteChange = (id: number, newContent: string) => {
    setEditedNotes(
      editedNotes.map((note) =>
        note.id === id ? { ...note, content: newContent } : note
      )
    );
  };

  const handleCancelChanges = async () => {
    handleModalState(false);
    await refreshNotes();
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    const success = await updateNotes(editedNotes);
    setIsSaving(false);

    if (success) {
      handleModalState(false);
      await refreshNotes();
    } else {
      setSavingError("There was a problem saving your note updates...");
    }
  };

  const handleModalState = (isOpen = false) => {
    if (!isOpen) {
      setSemanticEditModalState(false);
    }
  };

  return (
    <Dialog
      open={semanticEditModalIsOpen}
      handler={handleModalState}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      {isSaving && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10 pb-8">
          <FourSquare
            color="#249fe4"
            size="medium"
            text="Saving..."
            textColor=""
          />
        </div>
      )}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-auto p-8">
        <DialogHeader className="relative p-6 flex flex-col">
          <Typography variant="h2" color="blue-gray" className="text-2xl">
            Review AI Edited Notes
          </Typography>
          <Typography className="mt-3 text-gray-600 text-lg">
            Review the AI-suggested edits below. You can modify any note before
            saving.
          </Typography>
        </DialogHeader>
        <DialogBody className="px-6 py-2 max-h-[500px] overflow-y-auto">
          {editedNotes?.map((editedNote, index) => {
            const originalNote = queriedNotes.find(
              (ogNote) => ogNote.id === editedNote.id
            );
            return (
              <div
                key={editedNote.id}
                className="border rounded-md p-6 space-y-5 mb-6"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Original note */}
                  <div className="flex-1">
                    <h3 className="font-medium text-lg text-gray-600 mb-3">
                      {`${originalNote?.title} (Original)`}
                    </h3>
                    <div className="bg-gray-50 p-5 rounded-md text-gray-700 min-h-32 text-base">
                      {originalNote?.content || "Original content not found"}
                    </div>
                  </div>

                  {/* Edited note */}
                  <div className="flex-1">
                    <h3 className="font-medium text-lg text-gray-600 mb-3">
                      {`${editedNote?.title} (Edited)`}
                    </h3>
                    <Textarea
                      value={editedNote.content}
                      onChange={(e) =>
                        handleNoteChange(editedNote.id, e.target.value)
                      }
                      className="min-h-32 text-base p-3"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </DialogBody>

        <DialogFooter className="flex justify-end space-x-4 p-6">
          <Button
            className="cursor-pointer p-4 text-lg"
            variant="outlined"
            color="gray"
            size="lg"
            onClick={handleCancelChanges}
          >
            Cancel
          </Button>
          <Button
            className="cursor-pointer p-4 text-lg"
            variant="filled"
            color="blue"
            size="lg"
            onClick={handleSaveChanges}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </div>
    </Dialog>
  );
};

export default SemanticEditModal;
