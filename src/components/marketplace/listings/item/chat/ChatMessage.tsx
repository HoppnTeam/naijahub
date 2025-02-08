
import { format, formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const { user } = useAuth();
  const isOwn = message.sender_id === user?.id;

  return (
    <div
      className={`flex ${
        isOwn ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          isOwn
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <span className="text-xs opacity-70">
          {formatDistanceToNow(new Date(message.created_at), {
            addSuffix: true,
          })}
        </span>
      </div>
    </div>
  );
};
