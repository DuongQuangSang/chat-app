import { z } from "zod";

export const friendRequestSchema = z.object({
  to: z.string(),
  message: z.string().max(300).optional(),
});
