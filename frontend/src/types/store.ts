import { type User, type SignUpInput, type SignInInput } from "@moji/shared";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;

  init: () => Promise<void>;
  setAccessToken: (accessToken: string) => void;
  clearState: () => void;
  signUp: (data: SignUpInput) => Promise<void>;
  signIn: (data: SignInInput) => Promise<void>;
  signOut: () => Promise<void>;
  fetchMe: () => Promise<void>;
  refresh: () => Promise<void>;
}
