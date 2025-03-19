//@ts-nocheck
import React from "react";
import {
  Button,
  Dialog,
  Typography,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";

interface SignOutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function SignOutConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}: SignOutConfirmModalProps) {
  const handleConfirm = () => {
    onClose(); // Close the modal first
    onConfirm(); // Then execute the sign out action
  };

  return (
    <Dialog
      size="md"
      open={isOpen}
      handler={onClose}
      className="fixed inset-0 flex items-center justify-center p-4 text-center bg-black/50"
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <DialogHeader className="relative m-0 block">
          <Typography variant="h4" color="blue-gray">
            Sign Out Confirmation
          </Typography>
        </DialogHeader>
        <DialogBody className="space-y-4 px-2">
          <Typography
            style={{ fontSize: "1.75em", lineHeight: "normal", color: "black" }}
          >
            When you sign out, all your notes will be deleted to preserve
            database storage.
          </Typography>
          <Typography
            style={{
              fontSize: "1.25em",
              lineHeight: "normal",
              color: "gray-700",
            }}
          >
            Are you sure you want to continue?
          </Typography>
        </DialogBody>
        <DialogFooter className="flex justify-evenly mt-4">
          <Button
            className="text-lg font-medium px-5 py-2.5 text-white bg-gray-500"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="text-lg font-medium px-5 py-2.5 text-white bg-blue-500"
            onClick={handleConfirm}
          >
            Sign Out
          </Button>
        </DialogFooter>
      </div>
    </Dialog>
  );
}
