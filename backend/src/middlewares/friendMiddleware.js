import Conversation from "../models/Conversation.js";
import Friend from "../models/Friend.js";

const pair = (a, b) => (a < b ? [a, b] : [b, a]);

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const checkFriendship = async (req, res, next) => {
  try {
    const me = req.user._id.toString();
    const recipientId = req.body?.recipientId ?? null;
    const memberIds = req.body?.memberIds ?? null;

    // if (!recipientId && memberIds.length === 0) {
    //   return res.status(403).json({ message: "Cung cấp recipientId hoặc memberIds" });
    // }

    if (recipientId) {
      const [userA, userB] = pair(me, recipientId);

      const isFriend = await Friend.findOne({ userA, userB });

      if (!isFriend) {
        return res.status(403).json({ message: "Bạn chưa kết bạn với người nhận này" });
      }

      return next();
    }

    // todo: chat nhóm
    if (memberIds.length !== 0) {
      if (!memberIds.includes(me)) {
        return res.status(400).json({
          message: "Bạn phải là thành viên của nhóm",
        });
      }

      const otherMemberIds = memberIds.filter((id) => id.toString() !== me);
      const friendPairs = otherMemberIds.map((id) => pair(me, id));

      const friends = await Friend.find({
        $or: friendPairs.map(([userA, userB]) => ({ userA, userB })),
      });

      const friendSet = new Set(
        friends.map((f) => {
          const userA = f.userA.toString();
          const userB = f.userB.toString();
          return userA === me ? userB : userA;
        })
      );

      const notFriends = otherMemberIds.filter((id) => !friendSet.has(id));

      if (notFriends.length > 0) {
        return res.status(403).json({ message: "Bạn chỉ có thể thêm bạn bè vào nhóm", notFriends });
      }

      return next();
    }
  } catch (error) {
    console.error("Lỗi xảy ra khi gọi checkFriendship", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const checkGroupMembership = async (req, res, next) => {
  try {
    const conversationId = req.params?.conversationId ?? req.body?.conversationId;
    const userId = req.user._id;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Không tìm thấy cuộc trò chuyện" });
    }

    const isMember = conversation.participants.some(
      (p) => p.userId.toString() === userId.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: "Bạn không ở trong nhóm này" });
    }

    req.conversation = conversation;
    return next();
  } catch (error) {
    console.error("Lỗi xảy ra khi gọi checkGroupMembership", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const requireGroupConversation = async (req, res, next) => {
  if (req.conversation.type !== "group") {
    return res.status(400).json({
      message: "API này chỉ áp dụng cho cuộc trò chuyện nhóm",
    });
  }
  return next();
};
