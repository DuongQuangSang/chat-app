import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const createConversation = async (req, res) => {
  try {
    const { type, name, memberIds } = req.body;
    const userId = req.user._id;

    let conversation;

    if (type === "direct") {
      const participantId = memberIds[0];
      conversation = await Conversation.findOne({
        type: "direct",
        "participants.userId": { $all: [userId, participantId] },
      });

      if (!conversation) {
        conversation = new Conversation({
          type: "direct",
          participants: [{ userId: userId }, { userId: participantId }],
          lastMessageAt: new Date(),
        });

        await conversation.save();
      }
    }

    if (type === "group") {
      conversation = new Conversation({
        type: "group",
        participants: [...memberIds.map((id) => ({ userId: id }))],
        group: {
          name,
          createdBy: userId,
        },
        lastMessageAt: new Date(),
      });

      await conversation.save();
    }

    await conversation.populate([
      { path: "participants.userId", select: "displayName avatarUrl" },
      { path: "seenBy", select: "displayName avatarUrl" },
      { path: "lastMessage.senderId", select: "displayName avatarUrl" },
    ]);

    return res.status(201).json({ conversation });
  } catch (error) {
    console.error("Lỗi khi gọi createConversation", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const conversations = await Conversation.find({
      "participants.userId": userId,
    })
      .sort({ lastMessageAt: -1, updateAt: -1 })
      .populate({
        path: "participants.userId",
        select: "displayName avatarUrl",
      })
      .populate({
        path: "lastMessage.senderId",
        select: "displayName avatarUrl",
      })
      .populate({
        path: "seenBy",
        select: "displayName avatarUrl",
      });

    const formatted = conversations.map((convo) => {
      const participants = (convo.participants || []).map((p) => ({
        _id: p.userId?._id,
        displayName: p.userId?.displayName,
        avatarUrl: p.userId?.avatarUrl ?? null,
        joinedAt: p.joinedAt,
      }));

      return {
        ...convo.toObject(),
        unreadCounts: convo.unreadCounts || {},
        participants,
      };
    });

    return res.status(200).json({ conversations: formatted });
  } catch (error) {
    console.error("Lỗi khi gọi getConversations", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit = 50, cursor } = req.query;

    const query = { conversationId };

    if (cursor) {
      query.createAt = { $lt: new Date(cursor) };
    }

    let messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit) + 1);

    let nextCursor = null;

    if (messages.length > Number(limit)) {
      const nextMessage = messages[messages.length - 1];
      nextCursor = nextMessage.createdAt.toISOString();
      messages.pop();
    }

    messages = messages.reverse();

    return res.status(200).json({
      messages,
      nextCursor,
    });
  } catch (error) {
    console.error("Lỗi khi gọi getMessages", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getUserConversationForSocketIO = async (userId) => {
  try {
    const conversations = await Conversation.find({ "participants.userId": userId }, { _id: 1 });

    return conversations.map((c) => c._id.toString());
  } catch (error) {
    console.error("Lỗi khi gọi getUserConversationForSocketIO", error);
    return [];
  }
};
