// client/src/lib/firebaseAuth.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

// Sign up with email & password
export const signUpWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

// Sign in with email & password
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

// Sign in as guest (anonymous)
export const signInAsGuest = async (): Promise<User> => {
  const userCredential = await signInAnonymously(auth);
  return userCredential.user;
};

// Sign in with OAuth (Google, GitHub, LinkedIn)
export const signInWithOAuth = async (
  providerName: "google" | "github" | "linkedin"
): Promise<User> => {
  let provider;
  if (providerName === "google") {
    provider = new GoogleAuthProvider();
  } else if (providerName === "github") {
    provider = new GithubAuthProvider();
  } else if (providerName === "linkedin") {
    // Firebase doesn't provide a built-in LinkedIn provider, so use a generic OAuth provider
    provider = new OAuthProvider("linkedin.com");
  } else {
    throw new Error("Unsupported provider");
  }
  const userCredential = await signInWithPopup(auth, provider);
  return userCredential.user;
};
