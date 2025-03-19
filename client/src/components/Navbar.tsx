"use client";

import { useUserStore } from "@/store/useUserStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SignOutConfirmModal from "./SignOutConfirmModal";

export default function Navbar() {
  const { user, signOut } = useUserStore();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth");
  };

  const openSignOutModal = () => {
    setIsSignOutModalOpen(true);
  };

  const closeSignOutModal = () => {
    setIsSignOutModalOpen(false);
  };

  return (
    <nav className="bg-white shadow-md py-3 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo and brand */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-semibold text-gray-800">
            WhisprNotes
          </span>
        </Link>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {user && (
            <button
              onClick={openSignOutModal}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-3 px-2 pt-2 pb-4 space-y-3">
          {user && (
            <button
              onClick={() => {
                openSignOutModal();
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-gray-600 hover:text-blue-500 transition-colors"
            >
              Sign Out
            </button>
          )}
        </div>
      )}
      <SignOutConfirmModal
        isOpen={isSignOutModalOpen}
        onClose={closeSignOutModal}
        onConfirm={handleSignOut}
      />
    </nav>
  );
}
