import { z } from "zod";

export const sendDMSchema = z.object({
  recipientId: z.string(),
  content: z.string(),
  conversationId: z.string().optional(),
});

export const sendGMSchema = z.object({
  content: z.string(),
  conversationId: z.string(),
});
