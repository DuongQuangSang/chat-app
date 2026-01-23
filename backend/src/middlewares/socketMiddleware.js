import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * @param {import("socket.io").Socket} socket
 * @param {import("express").NextFunction} next
 */
export const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Unauthozied - Token không tồn tại"));
    }

    const decodedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decodedUser) {
      return next(new Error("Unauthozied - Token không hợp lẽ hoặc đã hết hạn"));
    }

    const user = await User.findById(decodedUser.userId).select("-hashPassword");

    if (!user) {
      return next(new Error("User không tồn tại"));
    }

    socket.user = user;

    next();
  } catch (error) {
    console.error("Lỗi xảy ra khi gọi socketAuthMiddleware", error);
    next(new Error("Unauthozied"));
  }
};
