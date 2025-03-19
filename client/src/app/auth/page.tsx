"use client";

import { useState } from "react";
import { signInAsGuest } from "@/lib/auth";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useRouter } from "next/navigation";
import { FourSquare } from "react-loading-indicators";
import { useUserStore } from "@/store/useUserStore";
import { _User } from "@/types/_user";
import { _fetchUser } from "../api/postgresRequests";

export default function AuthPage() {
  // Initialize Supabase auth with Zustand store
  useSupabaseAuth();

  const router = useRouter();
  const { user, loading, setUser, createUser } = useUserStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FourSquare
          color="#249fe4"
          size="large"
          text="Loading..."
          textColor=""
        />
      </div>
    );
  }

  const handleGuestSignIn = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      // Check if guest user ID exists in localStorage
      const storedGuestId = localStorage.getItem("guestUserId");

      if (storedGuestId) {
        // User was previously a guest, fetch their info
        let postgresUser = await _fetchUser(storedGuestId);
        if (!postgresUser.data || postgresUser.data === null) {
          // Create the user in database if they don't exist
          await createUser(storedGuestId, true);
        }
        setUser({ id: storedGuestId } as _User);
      } else {
        // New guest user, create anonymous account
        const guestUser = await signInAsGuest();
        if (guestUser && guestUser.id) {
          // Save guest user ID to localStorage
          localStorage.setItem("guestUserId", guestUser.id);
          // Create user in backend
          await createUser(guestUser.id, true);
          setUser({ id: guestUser.id } as _User);
        }
      }

      router.push("/");
    } catch (err: any) {
      console.error("Guest sign-in error:", err);
      setError(err.message || "Failed to sign in as guest");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-blue-300 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Welcome to WhisprNotes
        </h2>

        <p className="text-center text-gray-600 mb-6">
          Sign in as a guest to start creating notes right away. No account
          required!
        </p>

        <button
          onClick={handleGuestSignIn}
          className="w-full p-3 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Continue as Guest"}
        </button>

        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      </div>
    </div>
  );
}
