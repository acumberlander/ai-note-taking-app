import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

/**
 * Sign up with email & password
 * @param email
 * @param password
 * @returns {User | null}
 */
export const signUpWithEmail = async (
  email: string,
  password: string
): Promise<User | null> => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data.user || null;
};

/**
 * Sign in with email & password
 * @param email
 * @param password
 * @returns {User | null}
 */
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<User | null> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data.user || null;
};

/**
 * Sign in as guest (Anonymous)
 * @returns {User | null}
 */
export const signInAsGuest = async (): Promise<User | null> => {
  try {
    const { data, error } = await supabase.auth.signInAnonymously();

    if (error) {
      console.error("Supabase auth error:", error);
      throw error;
    }

    return data.user || null;
  } catch (err) {
    console.error("Guest sign-in failed:", err);
    throw err;
  }
};

/**
 * Sign out
 */
export const signOut = async (): Promise<void> => {
  await supabase.auth.signOut();
};
