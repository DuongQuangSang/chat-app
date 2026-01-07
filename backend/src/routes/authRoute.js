import express from "express";
import { signUp, signIn, signOut } from "../controllers/authController.js";
import { validateBody } from "../middlewares/validateMiddleware.js";
import { signUpSchema } from "@moji/shared";

const router = express.Router();

router.post("/signup", validateBody(signUpSchema), signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);

export default router;
