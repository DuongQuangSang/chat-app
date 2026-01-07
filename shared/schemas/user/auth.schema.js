import { z } from "zod";

export const signUpSchema = z.object({
  lastName: z.string().min(1, "Họ bắt buộc phải có"),
  firstName: z.string().min(1, "Tên bắt buộc phải có"),
  username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
  email: z.email("Email không hợp lệ"),
  password: z.string().min(3, "Mật khẩu phải có ít nhất 3 ký tự"),
});

export const signInSchema = z.object({
  username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
  password: z.string().min(3, "Mật khẩu phải có ít nhất 3 ký tự"),
});
