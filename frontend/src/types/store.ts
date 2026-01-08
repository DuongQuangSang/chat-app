import { type User, type SignUpInput, type SignInInput } from "@moji/shared";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;

  clearState: () => void;
  signUp: (data: SignUpInput) => Promise<void>;
  signIn: (data: SignInInput) => Promise<void>;
  signOut: () => Promise<void>;
}
