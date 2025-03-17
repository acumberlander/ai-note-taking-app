"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/store/useUserStore";
import { _fetchUser } from "@/app/api/postgresRequests";

export function useSupabaseAuth() {
  const { user, loading, setUser, setLoading, createUser } = useUserStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Check if user is authenticated with Supabase
        const { data } = await supabase.auth.getUser();
        
        // If user exists in Supabase, update user store
        if (data.user) {
          try {
            // Check if user exists in backend database
            const postgresUser = await _fetchUser(data.user.id);
            
            // The response might come directly as a User object or have a data property
            if (!postgresUser || (postgresUser.hasOwnProperty('data') && postgresUser.data === null)) {
              // Create user in backend if not exists
              const isAnonymous = data.user.app_metadata?.provider === 'anonymous' || false;
              await createUser(data.user.id, isAnonymous);
            }
            
            // Update user store
            setUser({ id: data.user.id });
          } catch (error) {
            console.error("Error fetching user:", error);
            // Still set the user in the store to avoid blocking the app
            setUser({ id: data.user.id });
          }
        } else {
          // Check if we have a guest user ID in localStorage
          const storedGuestId = localStorage.getItem("guestUserId");
          
          if (storedGuestId) {
            try {
              // Try to fetch the guest user
              const postgresUser = await _fetchUser(storedGuestId);
              
              // The response might come directly as a User object or have a data property that's non-null
              if (postgresUser && (!postgresUser.hasOwnProperty('data') || postgresUser.data)) {
                // User exists, set in user store
                setUser({ id: storedGuestId });
              } else {
                // User doesn't exist anymore, clear localStorage
                localStorage.removeItem("guestUserId");
                setUser(null);
              }
            } catch (error) {
              console.error("Error fetching guest user:", error);
              localStorage.removeItem("guestUserId");
              setUser(null);
            }
          } else {
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Run initial auth check
    initializeAuth();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const isAnonymous = session.user.app_metadata?.provider === 'anonymous';
          
          // Check if user exists in backend
          try {
            const postgresUser = await _fetchUser(session.user.id);
            
            // The response might come directly as a User object or have a data property
            if (!postgresUser || (postgresUser.hasOwnProperty('data') && postgresUser.data === null)) {
              // Create user in backend
              await createUser(session.user.id, isAnonymous);
            }
            
            // Update user store
            setUser({ id: session.user.id });
            
            // If anonymous user, store ID in localStorage
            if (isAnonymous) {
              localStorage.setItem("guestUserId", session.user.id);
            }
          } catch (error) {
            console.error("Error updating user store:", error);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          // Don't clear guest ID on signout unless explicitly signing out a guest
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [setUser, setLoading, createUser]);

  return { user, loading };
}