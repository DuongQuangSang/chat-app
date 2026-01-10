import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const protectedRoute = async (req, res, next) => {
  try {
    // lấy token từ header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Không tìm thấy access token" });
    }

    // xác nhận token hợp lệ
    const decodedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // tìm user
    const user = await User.findById(decodedUser.userId).select("-hashedPassword");

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // trả user về trong req
    req.user = user;
    next();
  } catch (error) {
    console.error("Lỗi khi duyệt qua protectedRoute", error);
    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

export default protectedRoute;
