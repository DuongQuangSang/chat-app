import { create } from "zustand";
import { toast } from "sonner";
import { z } from "zod";

import { signUpSchema } from "@moji/shared";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";

type SignUpInput = z.infer<typeof signUpSchema>;

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  signUp: async (data: SignUpInput) => {
    try {
      set({ loading: true });
      // gọi api
      await authService.signUp(data);

      toast.success("Đăng ký thành công! Bạn sẽ được chuyển sang trang đăng nhập");
    } catch (error) {
      console.error(error);
      toast.error("Đăng ký không thành công");
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
