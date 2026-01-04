import bcrypt from "bcrypt";
import User from "../models/User.js";

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
