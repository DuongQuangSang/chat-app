import { z } from "zod";

/* ======================================================
 * Auth schemas (input)
 * ====================================================== */
export const signUpSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export const signInSchema = z.object({
  username: z.string(),
  password: z.string(),
});

/* ======================================================
 * User (full – dùng cho auth, profile)
 * ====================================================== */
export const userBaseSchema = z.object({
  _id: z.string(),
  username: z.string(),
  email: z.string(),
  displayName: z.string(),

  avatarUrl: z.string().optional(),
  bio: z.string().optional(),
  phone: z.string().optional(),

  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

/* ======================================================
 * User public (public profile – dùng cho friend, message)
 * ====================================================== */
export const userPublicSchema = userBaseSchema.pick({
  _id: true,
  username: true,
  displayName: true,
  avatarUrl: true,
});

/* ======================================================
 * Friend request (response)
 * ====================================================== */
export const friendRequestSchema = z.object({
  requestId: z.string(),
  from: userPublicSchema,
  createdAt: z.string(),
});

/* ======================================================
 * Participant (snapshot user trong conversation)
 * ====================================================== */
export const participantSchema = z.object({
  _id: z.string(),
  displayName: z.string(),
  avatarUrl: z.string().nullable().optional(),
  joinedAt: z.string(), // ISO date
});

/* ======================================================
 * Seen user (ai đã xem conversation)
 * ====================================================== */
export const seenUserSchema = z.object({
  _id: z.string(),
  displayName: z.string().optional(),
  avatarUrl: z.string().nullable().optional(),
});

/* ======================================================
 * Group info (chỉ tồn tại nếu type = group)
 * ====================================================== */
export const groupSchema = z.object({
  name: z.string(),
  createdBy: z.string(), // userId
});

/* ======================================================
 * Last message (denormalized – tối ưu list)
 * ====================================================== */
export const lastMessageSchema = z.object({
  _id: z.string(),
  content: z.string().nullable(),
  createdAt: z.string(),
  sender: userPublicSchema,
});

/* ======================================================
 * Conversation
 * ====================================================== */
export const conversationSchema = z.object({
  _id: z.string(),

  type: z.enum(["direct", "group"]),

  // chỉ tồn tại nếu type = group
  group: groupSchema.optional(),

  participants: z.array(participantSchema),

  lastMessageAt: z.string().optional(),

  seenBy: z.array(seenUserSchema),

  lastMessage: lastMessageSchema.nullable(),

  // key = userId, value = unread count
  unreadCounts: z.record(z.number()),

  createdAt: z.string(),
  updatedAt: z.string(),
});

/* ======================================================
 * Conversation list response
 * ====================================================== */
export const conversationResponseSchema = z.object({
  conversations: z.array(conversationSchema),
});

/* ======================================================
 * Message
 * ====================================================== */
export const messageSchema = z.object({
  _id: z.string(),
  conversationId: z.string(),
  senderId: z.string(),

  content: z.string().nullable(),
  imgUrl: z.string().nullable().optional(),

  createdAt: z.string(),
  updatedAt: z.string().optional(),

  // FE-only (không lưu DB)
  isOwn: z.boolean().optional(),
});

/* ======================================================
 * Inferred types
 * ====================================================== */
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;

export type User = z.infer<typeof userBaseSchema>;
export type UserPublic = z.infer<typeof userPublicSchema>;

export type Friend = UserPublic;
export type FriendRequest = z.infer<typeof friendRequestSchema>;

export type Participant = z.infer<typeof participantSchema>;
export type SeenUser = z.infer<typeof seenUserSchema>;
export type Group = z.infer<typeof groupSchema>;
export type LastMessage = z.infer<typeof lastMessageSchema>;

export type Conversation = z.infer<typeof conversationSchema>;
export type ConversationResponse = z.infer<typeof conversationResponseSchema>;

export type Message = z.infer<typeof messageSchema>;
