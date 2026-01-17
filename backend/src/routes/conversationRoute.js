import express from "express";
import { createConvSchema } from "@moji/shared";
import { validateBody } from "../middlewares/validateMiddleware.js";
import { createConversation, getConversations, getMessages } from "../controllers/conversationController.js";
import { checkFriendship, checkGroupMembership } from "../middlewares/friendMiddleware.js";

const router = express.Router();

router.post("/", validateBody(createConvSchema), checkFriendship, createConversation);
router.get("/", getConversations);
router.get("/:conversationId/messages", checkGroupMembership, getMessages);

export default router;
