import { useAuthStore } from "@/stores/useAuthStore";
import React, { useState } from "react";
import type { Conversation } from "@moji/shared";
import { Button } from "@/components/ui/button";
import { ImagePlus, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import EmojiPicker from "@/components/chat/EmijoPicker";
import { useChatStore } from "@/stores/useChatStore";
import { toast } from "sonner";

const MessageInput = ({ selectedConvo }: { selectedConvo: Conversation }) => {
  const { user } = useAuthStore();
  const { sendDirectMessage, sendGroupMessage } = useChatStore();
  const [value, setValue] = useState("");

  if (!user) return;

  const sendMessage = async () => {
    if (!value.trim) return;
    const currentValue = value;
    setValue("");

    try {
      if (selectedConvo.type === "direct") {
        const participents = selectedConvo.participants;
        const otherUser = participents.filter((p) => p._id !== user._id)[0];
        await sendDirectMessage(otherUser._id, currentValue);
      } else {
        await sendGroupMessage(selectedConvo._id, currentValue);
      }
    } catch (error) {
      console.error("MessageInput", error);
      toast.error("Lỗi xảy ra khi gửi tin nhắn");
    }
  };

  const handlerKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };
  return (
    <div className="flex items-center gap-2 p-3 min-h-14 bg-background">
      <Button variant="ghost" size="icon" className="hover:bg-primary/10 transition-smooth">
        <ImagePlus className="size-4"></ImagePlus>
      </Button>

      <div className="flex-1 relative">
        <Input
          onKeyPress={handlerKeyPress}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Soạn tin nhắn..."
          className="pr-20 h-9 bg-white border-border/50 focus:border-primary/50 transition-smooth resize-none"
        ></Input>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="size-8 hover:bg-primary/10 transition-smooth"
          >
            <div>
              <EmojiPicker onChange={(emoji: string) => setValue(`${value}${emoji}`)} />
            </div>
          </Button>
        </div>
      </div>

      <Button
        onClick={sendMessage}
        className="bg-gradient-chat hover:shadow-glow transition-smooth hover:scale-105"
        disabled={!value.trim()}
      >
        <Send className="size-4 text-white" />
      </Button>
    </div>
  );
};

export default MessageInput;
