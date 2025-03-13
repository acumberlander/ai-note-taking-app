import { useState } from "react";

/**
 * Modal hook that returns the modal state and functions that open and close modals.
 * @returns Modal props: isOpen, openModal (function), closeModal (function)
 */
export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  return { isOpen, openModal, closeModal, isSaving, setIsSaving };
};
