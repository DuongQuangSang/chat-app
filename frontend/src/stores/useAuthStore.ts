import { create } from "zustand";
import { toast } from "sonner";

import { type SignUpInput, type SignInInput } from "@moji/shared";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  clearState: () => {
    set({
      accessToken: null,
      user: null,
      loading: false,
    });
  },

  signUp: async (data: SignUpInput) => {
    try {
      set({ loading: true });
      // gọi api
      await authService.signUp(data);

      toast.success("Đăng ký thành công! Bạn sẽ được chuyển sang trang đăng nhập");
    } catch (error) {
      console.error(error);
      toast.error("Đăng ký không thành công");
    } finally {
      set({ loading: false });
    }
  },
  signIn: async (data: SignInInput) => {
    try {
      set({ loading: true });
      const { accessToken } = await authService.signIn(data);
      set({ accessToken });

      await get().fetchMe();

      toast.success("Chào mừng bạn quay lại với Moji");
    } catch (error) {
      console.error(error);
      toast.error("Đăng nhập không thành công");
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      get().clearState();
      await authService.signOut();
      toast.success("Đăng xuất thành công");
    } catch (error) {
      console.error(error);
      toast.error("Đăng xuất không thành công");
    }
  },
  fetchMe: async () => {
    try {
      set({ loading: true });
      const user = await authService.fetchMe();

      set({ user });
    } catch (error) {
      console.error(error);
      set({
        accessToken: null,
        user: null,
      });
      toast.error("Đăng xuất không thành công");
    } finally {
      set({ loading: false });
    }
  },
}));
