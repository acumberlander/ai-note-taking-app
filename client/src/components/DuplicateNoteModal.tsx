//@ts-nocheck
import React from "react";
import {
  Button,
  Dialog,
  Typography,
  DialogBody,
  DialogHeader,
  DialogFooter,
} from "@material-tailwind/react";
import { useNoteStore } from "@/store/useNoteStore";
import { useUserStore } from "@/store/useUserStore";

export default function DuplicateNoteModal() {
  const {
    duplicateNoteModalIsOpen,
    setDuplicateNoteModalState,
    potentialDuplicateNote,
    setPotentialDuplicateNote,
    aiResponse,
    updateAiResponse,
  } = useNoteStore();

  const { user } = useUserStore.getState();

  const handleModalState = (isOpen = false) => {
    setDuplicateNoteModalState(isOpen);
    if (!isOpen) {
      setPotentialDuplicateNote(null);
      // Reset AI response when canceling
      updateAiResponse("");
    }
  };

  const handleCreateAnyway = async () => {
    if (!potentialDuplicateNote || !user) {
      handleModalState(false);
      return;
    }

    try {
      // Call the regular create endpoint but with skipSimilarityCheck flag
      const response = await fetch(`${API_URL}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: potentialDuplicateNote.content,
          title: potentialDuplicateNote.title,
          user_id: user.id,
          skipSimilarityCheck: true, // Skip similarity check on confirmation
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create note");
      }

      const result = await response.json();

      // Update the note list with the newly created note
      if (result.note) {
        updateNotes([result.note, ...notes]);
      }

      updateAiResponse("I've created your note despite the similarities.");
    } catch (error) {
      console.error("Error creating note:", error);
      updateAiResponse("Sorry, I couldn't create your note.");
    } finally {
      handleModalState(false);
    }
  };

  const handleCancel = () => {
    // Reset AI response when canceling
    updateAiResponse("");
    handleModalState(false);
  };

  if (!potentialDuplicateNote) {
    return null;
  }

  return (
    <Dialog
      size="xl"
      open={duplicateNoteModalIsOpen}
      handler={handleModalState}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-auto p-8">
        <DialogHeader className="relative p-6 flex flex-col">
          <Typography variant="h2" color="blue-gray" className="text-4xl">
            Similar Notes Found
          </Typography>
          <Typography className="mt-4 text-gray-600 text-2xl">
            I found similar notes to what you're trying to create. Do you still
            want to create a new note?
          </Typography>
        </DialogHeader>
        <DialogBody className="px-6 py-4 max-h-96 overflow-y-auto">
          <div className="mb-6 p-4 border-2 border-blue-300 rounded-lg bg-blue-50">
            <Typography variant="h4" className="mb-2 text-blue-800">
              New Note Content:
            </Typography>
            <div className="p-3 bg-white rounded markdown-content">
              <Typography
                style={{ fontSize: "1.75em", lineHeight: "normal" }}
                className="markdown-content"
              >
                {potentialDuplicateNote.content}
              </Typography>
            </div>
          </div>

          <Typography variant="h4" className="mb-4 text-gray-700">
            Similar Existing Notes:
          </Typography>
          <ul className="space-y-4">
            {potentialDuplicateNote.similarNotes?.map((note) => (
              <li key={note.id} className="flex flex-start py-3 px-4">
                <div className="flex flex-col p-3 border-2 rounded shadow-md w-full">
                  <div className="flex">
                    <Typography
                      variant="subtitle1"
                      className="text-2xl font-bold"
                    >
                      {note.title}
                    </Typography>
                  </div>
                  <div className="mt-3">
                    <Typography
                      variant="paragraph"
                      color="gray"
                      className="text-[1.5em] markdown-content"
                    >
                      {note.content}
                    </Typography>
                  </div>
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
            onClick={handleCancel}
            size="lg"
          >
            Cancel
          </Button>
          <Button
            className="text-lg font-medium px-5 py-2.5 cursor-pointer text-white"
            variant="filled"
            color="blue"
            onClick={handleCreateAnyway}
            size="lg"
          >
            Create Note Anyway
          </Button>
        </DialogFooter>
      </div>
    </Dialog>
  );
}
