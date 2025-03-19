// client/src/store/useUserStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { _User, UserStore } from "@/types/_user";
import { signOut } from "@/lib/auth";
import { _createUser } from "@/app/api/postgresRequests";
import { _deleteNotes, _fetchAllNotes } from "@/app/api/postgresRequests";

export const useUserStore = create<UserStore>()(
  devtools((set, get) => ({
    user: null,
    loading: true,
    setUser: (user: _User | null) => {
      set(() => ({ user }));
    },
    signOut: async () => {
      const { user } = get();
      if (user && user.id) {
        const notes = await _fetchAllNotes(user.id);
        await _deleteNotes(notes, user.id);
      }
      await signOut();
      localStorage.removeItem("guestUserId");
      set({ user: null });
    },
    setLoading: (isLoading: boolean) => {
      set(() => ({ loading: isLoading }));
    },
    createUser: async (id: string, is_anonymous: boolean) => {
      await _createUser(id, is_anonymous);
      set(() => ({ user: { id } }));
    },
  }))
);
