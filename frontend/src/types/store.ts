import { z } from "zod";
import { userBaseSchema, signUpSchema } from "@moji/shared";

export type User = z.infer<typeof userBaseSchema>;
export type SignUpFormInput = z.infer<typeof signUpSchema>;

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;

  signUp: (data: SignUpFormInput) => Promise<void>;
}
