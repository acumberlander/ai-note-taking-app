"use client";

import { useState, useEffect } from "react";
import { signUpWithEmail, signInWithEmail, signInAsGuest } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { FourSquare } from "react-loading-indicators";

export default function AuthPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Redirect authenticated users AFTER the component renders
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

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
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      // No need to call router.push("/") here, useEffect will handle it
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestSignIn = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      await signInAsGuest();
      // No need to call router.push("/") here, useEffect will handle it
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
