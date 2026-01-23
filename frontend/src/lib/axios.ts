import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// gắn accessToken vào request header
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// tự động gọi refresh api sau khi access token hết hạn
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalReq = error.config;

    // 🔴 1️⃣ CHẶN REFRESH KHI ĐANG LOGOUT (VỊ TRÍ ĐÚNG)
    const { isLoggingOut } = useAuthStore.getState();
    if (isLoggingOut) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401 || originalReq._retry) {
      return Promise.reject(error);
    }

    if (
      originalReq.url?.endsWith("/auth/signin") ||
      originalReq.url?.endsWith("/auth/signup") ||
      originalReq.url?.endsWith("/auth/refresh") ||
      originalReq.url?.endsWith("/auth/signout") // ✅ BẮT BUỘC
    ) {
      return Promise.reject(error);
    }

    originalReq._retry = true;

    try {
      const res = await api.post("/auth/refresh");
      const newAccessToken = res.data.accessToken;

      useAuthStore.getState().setAccessToken(newAccessToken);

      originalReq.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalReq);
    } catch (refreshError) {
      useAuthStore.getState().clearState();
      return Promise.reject(refreshError);
    }
  }
);
export default api;
