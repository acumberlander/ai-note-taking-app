"use client";

import { useState, useEffect } from "react";
import {
  signUpWithEmail,
  signInWithEmail,
  signInAsGuest,
} from "@/lib/auth";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useRouter } from "next/navigation";
import { FourSquare } from "react-loading-indicators";
import axios from "axios";
import { useUserStore } from "@/store/useUserStore";
import { _User } from "@/types/_user";
import { _fetchUser } from "../api/postgresRequests";

export default function AuthPage() {
  // Initialize Supabase auth with Zustand store
  useSupabaseAuth();
  
  const router = useRouter();
  const { user, loading, setUser, setLoading, createUser } = useUserStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (isRegistering) {
        const newUser = await signUpWithEmail(email, password);
        if (newUser && newUser.id) {
          // Create user in your backend database (if not already created)
          await axios.post(
            `${
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
            }/api/users/${newUser.id}`,
            { id: newUser.id, is_anonymous: false, email }
          );
          setUser({ id: newUser.id } as _User);
          router.push("/");
        }
      } else {
        const returningUser = await signInWithEmail(email, password);
        if (returningUser && returningUser.id) {
          // Check and create user in backend if needed
          let postgresUser = await _fetchUser(returningUser.id);
          if (!postgresUser.data || postgresUser.data === null) {
            await createUser(returningUser.id, false);
          }
          setUser({ id: returningUser.id } as _User);
          router.push("/");
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleOAuthSignIn = async (
  //   provider: "google" | "github" | "linkedin"
  // ) => {
  //   try {
  //     const oauthUser = await signInWithOAuth(provider);
  //     if (oauthUser && oauthUser.uid) {
  //       // Check and create user in backend if needed
  //       let postgresUser = await axios.get(
  //         `${
  //           process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
  //         }/api/users/${oauthUser.uid}`
  //       );
  //       if (!postgresUser.data || postgresUser.data === null) {
  //         postgresUser = await axios.post(
  //           `${
  //             process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
  //           }/api/users/${oauthUser.uid}`,
  //           { id: oauthUser.uid, is_anonymous: false, email: oauthUser.email }
  //         );
  //       }
  //       setUser({ id: oauthUser.uid } as _User);
  //     }
  //   } catch (err: any) {
  //     setError(err.message);
  //   }
  // };

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
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {isRegistering ? "Create an Account" : "Sign In"}
        </h2>
        <p className="text-gray-600 text-center mt-2">
          {isRegistering
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-blue-500 hover:underline"
          >
            {isRegistering ? "Sign In" : "Sign Up"}
          </button>
        </p>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded mt-2"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded mt-2"
            required
          />

          <button
            type="submit"
            className="w-full p-3 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-400"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Processing..."
              : isRegistering
              ? "Sign Up"
              : "Sign In"}
          </button>
        </form>

        <div className="text-center my-4 text-gray-500">OR</div>

        {/* <button
          onClick={handleOAuthSignIn.bind(null, "google")}
          className="w-full p-3 mb-2 text-white bg-red-500 rounded hover:bg-red-600"
          disabled={isSubmitting}
        >
          Sign in with Google
        </button>
        <button
          onClick={handleOAuthSignIn.bind(null, "github")}
          className="w-full p-3 mb-2 text-white bg-gray-800 rounded hover:bg-gray-900"
          disabled={isSubmitting}
        >
          Sign in with GitHub
        </button>
        <button
          onClick={handleOAuthSignIn.bind(null, "linkedin")}
          className="w-full p-3 mb-2 text-white bg-blue-700 rounded hover:bg-blue-800"
          disabled={isSubmitting}
        >
          Sign in with LinkedIn
        </button>

        <div className="text-center my-4 text-gray-500">OR</div> */}

        <button
          onClick={handleGuestSignIn}
          className="w-full p-3 mt-2 text-white bg-yellow-500 rounded hover:bg-yellow-600 disabled:bg-gray-400"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Continue as Guest"}
        </button>
      </div>
    </div>
  );
}
