import { create } from "zustand";
import { io, type Socket } from "socket.io-client";
import { useAuthStore } from "@/stores/useAuthStore";
import type { SocketState } from "@/types/store";
import { useChatStore } from "@/stores/useChatStore";

const baseURL = import.meta.env.VITE_SOCKET_URL;

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  onlineUsers: [],
  connectSocket: () => {
    const accessToken = useAuthStore.getState().accessToken;
    // ✅ Fix 1: Chặn connect khi KHÔNG có token
    if (!accessToken) return;

    const existingSocket = get().socket;

    if (existingSocket) return;

    const socket: Socket = io(baseURL, {
      auth: { token: accessToken },
      transports: ["websocket"],
    });

    set({ socket });

    socket.on("connect", () => {
      console.log("Đã kết nối với socket");
    });

    //online users
    socket.on("online-users", (userIds) => {
      set({ onlineUsers: userIds });
    });

    // new message
    socket.on("new-message", ({ message, conversation, unreadCounts }) => {
      useChatStore.getState().addMessage(message);

      const lastMessage = {
        _id: conversation.lastMessage._id,
        content: conversation.lastMessage.content,
        createdAt: conversation.lastMessage.createdAt,
        sender: {
          _id: conversation.lastMessage.senderId,
          displayName: "",
          avatarUrl: null,
        },
      };

      const updatedConversation = {
        ...conversation,
        lastMessage,
        unreadCounts,
      };

      if (useChatStore.getState().activeConversationId === message.conversationId) {
        // đánh dấu đã đọc
      }

      useChatStore.getState().updateConversation(updatedConversation);
    });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      // ✅ Fix 3: Tắt reconnect khi logout
      // socket.io.opts.reconnection = false; // ✅ CHỐT
      socket.disconnect();
      // ✅ Fix 3: Tắt reconnect khi logout
      // socket.removeAllListeners();
      set({ socket: null });
    }
  },
}));
