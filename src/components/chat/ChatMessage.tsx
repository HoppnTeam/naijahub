
import { useAuth } from "@/contexts/AuthContext";
import { ChatMessage as ChatMessageType } from "@/types/chat";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const { user } = useAuth();
  const isOwn = message.sender_id === user?.id;

  return (
    <div className={cn(
      "flex w-full",
      isOwn ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[70%] rounded-lg p-3",
        isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
      )}>
        <p className="text-sm break-words">{message.content}</p>
        <span className="text-xs opacity-70">
          {format(new Date(message.created_at), 'HH:mm')}
        </span>
      </div>
    </div>
  );
};
