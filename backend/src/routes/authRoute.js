import express from "express";
import { signUp, signIn, signOut, refreshToken } from "../controllers/authController.js";
import { validateBody } from "../middlewares/validateMiddleware.js";
import { signUpSchema, signInSchema } from "@moji/shared";

const router = express.Router();

router.post("/signup", validateBody(signUpSchema), signUp);
router.post("/signin", validateBody(signInSchema), signIn);
router.post("/signout", signOut);
router.post("/refresh", refreshToken);

export default router;
