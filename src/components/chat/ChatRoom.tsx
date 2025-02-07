
import { useEffect, useRef } from "react";
import { useChat } from "@/hooks/use-chat";
import { ChatMessage } from "./ChatMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send } from "lucide-react";
import { useState } from "react";

interface ChatRoomProps {
  roomId: string;
  className?: string;
}

export const ChatRoom = ({ roomId, className }: ChatRoomProps) => {
  const { messages, isLoading, sendMessage } = useChat(roomId);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    await sendMessage(newMessage);
    setNewMessage("");
    setIsSending(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className={className}>
      <ScrollArea className="h-[400px] p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSend} className="flex gap-2 p-4 border-t">
        <Input
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={isSending}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};
