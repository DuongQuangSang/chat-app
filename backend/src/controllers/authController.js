import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import Session from "../models/Session.js";

const ACCESS_TOKEN_TTL = "30m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const signUp = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;

    // kiểm tra input
    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({
        message:
          "Không thể thiếu username, password, email, firstName và lastName",
      });
    }

    // kiểm tra user đã tồn tại hay chưa
    const duplicate = await User.findOne({ username });
    if (duplicate) {
      return res.status(409).json({
        message: "Username đã tồn tại",
      });
    }

    // user chưa tồn tại -> hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // tạo user mới
    await User.create({
      username,
      hashedPassword,
      email,
      displayName: `${firstName} ${lastName}`,
    });

    return res.sendStatus(204);
  } catch (error) {
    console.error("Lỗi khi gọi signUp", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const signIn = async (req, res) => {
  try {
    // kiểm tra input
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        message:
          "Không thể thiếu username, password, email, firstName và lastName",
      });
    }

    // so sánh password
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        message: "Username hoặc password không chính xác",
      });
    }

    const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordCorrect) {
      return res.status(401).json({
        message: "Username hoặc password không chính xác",
      });
    }

    // tạo access token bằng jwt
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    // tạo và lưu refresh token
    const refreshToken = crypto.randomBytes(64).toString("hex");
    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    // trả refresh token về trong cookie
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: REFRESH_TOKEN_TTL,
    });

    // trả access token về trong res
    return res.status(200).json({
      message: `User ${user.displayName} đã đăng nhập`,
      accessToken,
    });
  } catch (error) {
    console.error("Lỗi khi gọi signIn", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const signOut = async (req, res) => {
  try {
    // lấy refresh token từ cookie
    const token = req.cookies?.refreshToken;

    // xóa refresh token trong Session
    if (token) {
      await Session.deleteOne({ refreshToken: token });

      // xóa cookie
      res.clearCookie("refreshToken");
      return res.sendStatus(204);
    }
  } catch (error) {
    console.error("Lỗi khi gọi signOut", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
