// client/src/store/useUserStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { _User, UserStore } from "@/types/_user";
import { User } from "firebase/auth";
import { _createUser } from "@/app/api/postgresRequests";

export const useUserStore = create<UserStore>()(
  devtools((set) => ({
    user: null,
    loading: true,
    setUser: (user: _User | null) => {
      set(() => ({ user }));
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
