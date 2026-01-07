import { ZodError } from "zod";

/**
 * Validate request body bằng Zod
 * @param {ZodSchema} schema
 */
export const validateBody = (schema) => {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Invalid request body",
          errors: error.flatten().fieldErrors,
        });
      }

      next(error);
    }
  };
};
