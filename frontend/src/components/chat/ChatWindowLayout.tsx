import ChatWelcomeScreen from "@/components/chat/ChatWelcomeScreen";
import ChatWindowBody from "@/components/chat/ChatWindowBody";
import ChatWindowHeader from "@/components/chat/ChatWindowHeader";
import ChatWindowSkeleton from "@/components/chat/ChatWindowSkeleton";
import MessageInput from "@/components/chat/MessageInput";
import { SidebarInset } from "@/components/ui/sidebar";
import { useChatStore } from "@/stores/useChatStore";

const ChatWindowLayout = () => {
  const { activeConversationId, conversations, messageLoading: loading, messages } = useChatStore();

  const selectedConvo = conversations.find((c) => c._id === activeConversationId) ?? null;

  if (!selectedConvo) {
    return <ChatWelcomeScreen />;
  }

  if (loading) {
    return <ChatWindowSkeleton />;
  }
  return (
    <SidebarInset className="flex flex-col h-full flex-1 overflow-hidden rounded-sm shadow-md">
      {/* Header */}
      <ChatWindowHeader chat={selectedConvo} />

      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-primary-foreground">
        <ChatWindowBody />
      </div>

      {/* Footer */}
      <MessageInput selectedConvo={selectedConvo} />
    </SidebarInset>
  );
};

export default ChatWindowLayout;
