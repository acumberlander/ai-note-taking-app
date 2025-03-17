import { User } from "firebase/auth";

// export interface _User extends NoUser {
//   id: string;
//   noteIds?: number[];
// }

// export interface NoUser {
//   message: string;
//   data: null;
// }

export type UserStore = {
  user: _User | null;
  loading: boolean;
  setUser: (user: _User | null) => void;
  setLoading: (isLoading: boolean) => void;
  createUser: (id: string, is_anonymous: boolean) => Promise<void>;
};

export interface _User {
  data?: any;
  id: string;
}
