import ChatCard from "@/components/chat/ChatCard";
import GroupChatAvatar from "@/components/chat/GroupChatAvatar";
import UnreadCountBagde from "@/components/chat/UnreadCountBagde";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import type { Conversation } from "@moji/shared";

const GroupChatCard = ({ convo }: { convo: Conversation }) => {
  const { user } = useAuthStore();
  const { activeConversationId, setActiveConversation, messages, fetchMessages } = useChatStore();

  if (!user) return null;

  const unreadCount = convo.unreadCounts[user._id] ?? 0;
  const name = convo.group?.name ?? "";

  const handleSelectConversation = async (id: string) => {
    setActiveConversation(id);
    if (!messages[id]) {
      await fetchMessages();
    }
  };
  return (
    <ChatCard
      convoId={convo._id}
      name={name}
      timestamp={convo.lastMessage?.createdAt ? new Date(convo.lastMessage.createdAt) : undefined}
      isActice={activeConversationId === convo._id}
      onSelect={handleSelectConversation}
      unreadCount={unreadCount}
      leftSection={
        <>
          {unreadCount > 0 && <UnreadCountBagde unreadCount={unreadCount} />}
          <GroupChatAvatar participants={convo.participants} type="chat" />
        </>
      }
      subtitle={
        <p className="text-sm truncate text-muted-foreground">
          {convo.participants.length} thành viên
        </p>
      }
    />
  );
};

export default GroupChatCard;
