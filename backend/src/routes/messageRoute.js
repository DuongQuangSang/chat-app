import express from "express";
import { sendDMSchema, sendGMSchema } from "@moji/shared";
import { validateBody } from "../middlewares/validateMiddleware.js";
import { sendDirectMessage, sendGroupMessage } from "../controllers/messageController.js";
import { checkFriendship, checkGroupMembership, requireGroupConversation } from "../middlewares/friendMiddleware.js";

const router = express.Router();

router.post("/direct", validateBody(sendDMSchema), checkFriendship, sendDirectMessage);
router.post("/group", validateBody(sendGMSchema), checkGroupMembership, requireGroupConversation, sendGroupMessage);

export default router;
