import { z } from "zod";

export const signUpSchema: z.ZodObject<{
  lastName: z.ZodString;
  firstName: z.ZodString;
  username: z.ZodString;
  email: z.ZodString;
  password: z.ZodString;
}>;
