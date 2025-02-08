
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

interface ChatMessageListProps {
  messages: Message[];
}

export const ChatMessageList = ({ messages }: ChatMessageListProps) => {
  return (
    <ScrollArea className="flex-1 p-4 h-[400px]">
      <div className="space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>
    </ScrollArea>
  );
};
