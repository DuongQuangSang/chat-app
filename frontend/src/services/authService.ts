import { z } from "zod";
import api from "@/lib/axios";
import { signUpSchema } from "@moji/shared";

type SignUpInput = z.infer<typeof signUpSchema>;

export const authService = {
  signUp: async (data: SignUpInput) => {
    const res = await api.post("/auth/signup", data, { withCredentials: true });
    return res.data;
  },
};
