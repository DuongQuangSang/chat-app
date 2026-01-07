import { z } from "zod";

export const userBaseSchema = z.object({
  _id: z.string(),
  username: z.string(),
  email: z.string().email(),
  displayName: z.string(),
  avatarUrl: z.string().optional(),
  bio: z.string().optional(),
  phone: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
