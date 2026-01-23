import { create } from "zustand";
import { toast } from "sonner";

import { type SignUpInput, type SignInInput } from "@moji/shared";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";
import { persist } from "zustand/middleware";
import { useChatStore } from "@/stores/useChatStore";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      loading: false,
      isLoggingOut: false,

      setAccessToken: (accessToken) => {
        set({ accessToken });
      },

      clearState: () => {
        set({
          accessToken: null,
          user: null,
          loading: false,
        });
        localStorage.clear();
        useChatStore.getState().reset();
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
          // localStorage.clear();
          // useChatStore.getState().reset();
          get().clearState();
          set({ loading: true });
          const { accessToken } = await authService.signIn(data);
          get().setAccessToken(accessToken);

          await get().fetchMe();
          useChatStore.getState().fetchConversations();

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
          set({ isLoggingOut: true });

          await authService.signOut();

          get().clearState();
          toast.success("Đăng xuất thành công");
        } catch (error) {
          console.error(error);
          toast.error("Đăng xuất không thành công");
        } finally {
          set({ isLoggingOut: false });
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
          toast.error("Lỗi xảy ra khi lấy dữ liệu người dùng. Hãy thử lại!");
        } finally {
          set({ loading: false });
        }
      },
      refresh: async () => {
        const { accessToken, isLoggingOut } = get();

        // 🔴 CHẶN TUYỆT ĐỐI
        if (!accessToken || isLoggingOut) {
          return;
        }

        try {
          set({ loading: true });
          const { user, fetchMe, setAccessToken } = get();
          const accessToken = await authService.refresh();

          setAccessToken(accessToken);

          if (!user) {
            await fetchMe();
          }
        } catch (error) {
          const { isLoggingOut } = get();
          if (!isLoggingOut) {
            toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
          }
          console.error(error);
          get().clearState();
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
