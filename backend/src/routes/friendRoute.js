import express from "express";
import { friendRequestSchema } from "@moji/shared";
import { validateBody } from "../middlewares/validateMiddleware.js";
import {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  getAllFriends,
  getFriendRequests,
} from "../controllers/friendController.js";

const router = express.Router();

router.post("/requests", validateBody(friendRequestSchema), sendFriendRequest);

router.post("/requests/:requestId/accept", acceptFriendRequest);
router.post("/requests/:requestId/decline", declineFriendRequest);

router.get("/", getAllFriends);
router.get("/requests", getFriendRequests);

export default router;
