import api from "@/lib/axios";
import { type SignUpInput, type SignInInput } from "@moji/shared";

export const authService = {
  signUp: async (data: SignUpInput) => {
    const res = await api.post("/auth/signup", data, { withCredentials: true });
    return res.data;
  },
  signIn: async (data: SignInInput) => {
    const res = await api.post("/auth/signin", data, { withCredentials: true });
    return res.data;
  },
  signOut: async () => {
    return await api.post("/auth/signout", { withCredentials: true });
  },
  fetchMe: async () => {
    const res = await api.get("/users/me", { withCredentials: true });
    return res.data.user;
  },
};
