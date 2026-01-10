import { create } from "zustand";
import { toast } from "sonner";

import { type SignUpInput, type SignInInput } from "@moji/shared";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  init: async () => {
    const { accessToken, user } = get();

    if (!accessToken) {
      await get().refresh();
    }

    if (get().accessToken && !user) {
      await get().fetchMe();
    }
  },

  setAccessToken: (accessToken) => {
    set({ accessToken });
  },

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
      get().setAccessToken(accessToken);

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
      await authService.signOut();
      get().clearState();
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
  refresh: async () => {
    try {
      set({ loading: true });
      const { user, fetchMe, setAccessToken } = get();
      const accessToken = await authService.refreshToken();

      setAccessToken(accessToken);

      if (!user) {
        await fetchMe();
      }
    } catch (error) {
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
      console.error(error);
      get().clearState();
    } finally {
      set({ loading: false });
    }
  },
}));
