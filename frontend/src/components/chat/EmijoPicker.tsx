import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useThemeStore } from "@/stores/useThemeStore";
import { Smile } from "lucide-react";
import EmojiPickerLib, { type EmojiClickData, Theme } from "emoji-picker-react";

interface EmojiPickerProps {
  onChange: (vale: string) => void;
}

const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  const { isDark } = useThemeStore();

  return (
    <Popover>
      <PopoverTrigger className="cursor-pointer">
        <Smile className="size-4" />
      </PopoverTrigger>

      <PopoverContent
        side="right"
        sideOffset={40}
        className="bg-tranparent border-none shadow-none drop-shadow-none mb-12"
      >
        <EmojiPickerLib
          theme={isDark ? Theme.DARK : Theme.LIGHT}
          onEmojiClick={(emojiData: EmojiClickData) => onChange(emojiData.emoji)}
          className="size-24"
        />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
