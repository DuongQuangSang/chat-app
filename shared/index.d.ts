import { z } from "zod";

export const signUpSchema: z.ZodObject<{
  lastName: z.ZodString;
  firstName: z.ZodString;
  username: z.ZodString;
  email: z.ZodString;
  password: z.ZodString;
}>;

export const signInSchema: z.ZodObject<{
  username: z.ZodString;
  password: z.ZodString;
}>;

export const userBaseSchema: z.ZodObject<{
  _id: z.ZodString;
  username: z.ZodString;
  email: z.ZodString;
  displayName: z.ZodString;
  avatarUrl: z.ZodOptional<z.ZodString>;
  bio: z.ZodOptional<z.ZodString>;
  phone: z.ZodOptional<z.ZodString>;
  createdAt: z.ZodOptional<z.ZodString>;
  updatedAt: z.ZodOptional<z.ZodString>;
}>;
