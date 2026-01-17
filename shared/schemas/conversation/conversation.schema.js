import { z } from "zod";

export const createConvSchema = z.discriminatedUnion("type", [
  // DIRECT
  z.object({
    type: z.literal("direct"),
    memberIds: z.array(z.string()).length(2),
  }),

  // GROUP
  z.object({
    type: z.literal("group"),
    memberIds: z
      .array(z.string())
      .min(2)
      .refine((ids) => new Set(ids).size === ids.length, "memberIds không được trùng"),
    name: z.string().min(1, "Tên nhóm là bắt buộc"),
  }),
]);
