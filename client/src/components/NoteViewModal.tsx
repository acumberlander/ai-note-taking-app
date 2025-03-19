// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  Dialog,
  Typography,
  DialogBody,
  DialogHeader,
  IconButton,
  Button,
  Textarea,
  Input,
} from "@material-tailwind/react";
import { useNoteStore } from "@/store/useNoteStore";
import { useUserStore } from "@/store/useUserStore";
import { Note as NoteType } from "@/types/note";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { FourSquare } from "react-loading-indicators";

interface NoteViewModalProps {
  isOpen: boolean;
  handleClose: () => void;
  currentNote: NoteType | null;
  onNavigate: (direction: "prev" | "next") => void;
}

export default function NoteViewModal({
  isOpen,
  handleClose,
  currentNote,
  onNavigate,
}: NoteViewModalProps) {
  const { setNoteToDelete, setDeleteModalState, updateNote, deleteNote } =
    useNoteStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // Only for animation
  const [confirmingDelete, setConfirmingDelete] = useState(false); // For confirmation UI
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showDeleteMessage, setShowDeleteMessage] = useState(false);
  const [deletedNoteTitle, setDeletedNoteTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
    }
  }, [currentNote]);

  const handleDeleteNote = () => {
    setConfirmingDelete(true);
  };

  const handleEditNote = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (currentNote && (title.trim() || content.trim())) {
      setIsSaving(true);
      await updateNote(currentNote.id, { title, content });
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
    }
    setIsEditing(false);
  };

  const handleConfirmDelete = async () => {
    if (!currentNote) return;

    setIsDeleting(true); // Start animation
    setConfirmingDelete(false); // Hide confirmation UI
    setDeletedNoteTitle(currentNote.title);

    try {
      const noteId = currentNote.id;
      const success = await deleteNote(noteId);

      if (success) {
        setShowDeleteMessage(true);

        // Show delete message for 2 seconds then navigate to next note or close modal
        setTimeout(() => {
          setShowDeleteMessage(false);

          // Check if there are any notes left to navigate to
          const { allNotes } = useNoteStore.getState();
          if (allNotes.length === 0) {
            // No notes left, close the modal
            handleClose();
            // Refresh notes to ensure UI is up to date
            const { fetchNotes } = useNoteStore.getState();
            const { user } = useUserStore.getState();
            fetchNotes(user?.id || null);
          } else {
            // Navigate to next note if available
            onNavigate("next");
          }
        }, 2000);
      } else {
        console.error("Delete operation returned false");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    } finally {
      setIsDeleting(false); // Stop animation
    }
  };

  const handleCancelDelete = () => {
    setConfirmingDelete(false);
  };

  if (!currentNote) return null;

  return (
    <Dialog
      size="xl"
      open={isOpen}
      handler={handleClose}
      className="fixed inset-0 flex items-center justify-center text-center bg-black/50"
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl px-8 py-8 relative">
        {/* Saving Animation Overlay */}
        {isSaving && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10 rounded-lg">
            <FourSquare
              color="#249fe4"
              size="large"
              text="Saving..."
              textColor=""
            />
          </div>
        )}

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

        <div className="flex justify-between items-center mb-4">
          {isEditing ? (
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-bold text-[1.875rem]"
              placeholder="Note Title"
              style={{ fontSize: "1.875rem", fontWeight: "bold" }}
            />
          ) : (
            <Typography variant="h3" color="blue-gray" className="text-left">
              {currentNote.title}
            </Typography>
          )}
          <IconButton
            variant="text"
            color="red"
            onClick={handleClose}
            className="hover:bg-red-50 flex items-center justify-center"
          >
            <XMarkIcon className="h-8 w-8" />
          </IconButton>
        </div>

        <DialogBody className="h-[30vh] overflow-y-auto p-0">
          {showDeleteMessage ? (
            <div className="flex items-center justify-center h-full">
              <Typography variant="h4" color="red">
                Your note "{deletedNoteTitle}" was deleted
              </Typography>
            </div>
          ) : confirmingDelete ? (
            <div className="space-y-4">
              <Typography variant="h4" color="red">
                Are you sure you want to delete this note?
              </Typography>
              <Typography className="font-bold">{currentNote.title}</Typography>
              <div className="prose max-w-none text-center overflow-y-auto max-h-40 p-2 border rounded">
                <div className="text-gray-600 mt-2 markdown-content">
                  <Typography
                    style={{ fontSize: "1.75em", lineHeight: "normal" }}
                  >
                    {currentNote.content}
                  </Typography>
                </div>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <Button
                  color="gray"
                  onClick={handleCancelDelete}
                  className="text-lg font-medium px-5 py-2.5 text-white"
                >
                  Cancel
                </Button>
                <Button
                  color="red"
                  onClick={handleConfirmDelete}
                  className="text-lg font-medium px-5 py-2.5 text-white"
                >
                  Delete
                </Button>
              </div>
            </div>
          ) : isEditing ? (
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full min-h-[20vh]"
              placeholder="Note Content"
              style={{ fontSize: "1.75em", lineHeight: "normal" }}
            />
          ) : (
            <div className="prose max-w-none text-left">
              <div className="markdown-content">
                <Typography
                  style={{ fontSize: "1.75em", lineHeight: "normal" }}
                >
                  {currentNote.content}
                </Typography>
              </div>
            </div>
          )}
        </DialogBody>

        {!confirmingDelete && !showDeleteMessage && (
          <div className="flex justify-between mt-4">
            <IconButton
              variant="filled"
              color="blue"
              onClick={() => onNavigate("prev")}
              className="flex items-center justify-center"
            >
              <ChevronLeftIcon className="h-6 w-6 text-white" />
            </IconButton>

            <div className="flex space-x-4">
              {isEditing ? (
                <>
                  <Button
                    color="gray"
                    onClick={handleCancelEdit}
                    className="text-lg font-medium px-5 py-2.5 text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    color="green"
                    onClick={handleSaveEdit}
                    className="text-lg font-medium px-5 py-2.5 text-white"
                  >
                    Save
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="filled"
                    color="red"
                    onClick={handleDeleteNote}
                    className="flex items-center justify-center text-lg font-medium px-5 py-2.5 text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6 mr-2 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                    Delete
                  </Button>
                  <Button
                    variant="filled"
                    color="blue"
                    onClick={handleEditNote}
                    className="flex items-center justify-center text-lg font-medium px-5 py-2.5 text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6 mr-2 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                    Edit
                  </Button>
                </>
              )}
            </div>

            <IconButton
              variant="filled"
              color="blue"
              onClick={() => onNavigate("next")}
              className="flex items-center justify-center"
            >
              <ChevronRightIcon className="h-6 w-6 text-white" />
            </IconButton>
          </div>
        )}
      </div>
    </Dialog>
  );
}
