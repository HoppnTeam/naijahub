
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ChatMessageList } from "./chat/ChatMessageList";
import { ChatInput } from "./chat/ChatInput";
import { useChatMessages } from "./chat/useChatMessages";

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: {
    id: string;
    title: string;
    seller?: {
      username?: string;
      user_id?: string;
    };
  };
}

export const ChatDialog = ({ open, onOpenChange, listing }: ChatDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState("");
  const [chatId, setChatId] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !user || !listing.seller?.user_id) return;

    const initializeChat = async () => {
      // Check for existing chat
      const { data: existingChat } = await supabase
        .from("marketplace_chats")
        .select("id")
        .match({
          listing_id: listing.id,
          sender_id: user.id,
          receiver_id: listing.seller?.user_id,
        })
        .maybeSingle();

      if (existingChat) {
        setChatId(existingChat.id);
      } else {
        // Create new chat
        const { data: newChat, error } = await supabase
          .from("marketplace_chats")
          .insert({
            listing_id: listing.id,
            sender_id: user.id,
            receiver_id: listing.seller?.user_id,
          })
          .select()
          .single();

        if (error) {
          toast({
            title: "Error",
            description: "Failed to create chat",
            variant: "destructive",
          });
          return;
        }

        setChatId(newChat.id);
      }
    };

    initializeChat();
  }, [open, user, listing]);

  const { messages, isLoading, sendMessage } = useChatMessages(chatId);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    await sendMessage(newMessage);
    setNewMessage("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Chat with {listing.seller?.username}</DialogTitle>
        </DialogHeader>

        <ChatMessageList messages={messages} />

        <ChatInput 
          value={newMessage}
          onChange={setNewMessage}
          onSubmit={handleSendMessage}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};
