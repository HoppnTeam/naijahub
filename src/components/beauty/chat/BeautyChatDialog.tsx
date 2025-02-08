
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ChatMessageList } from "@/components/marketplace/listings/item/chat/ChatMessageList";
import { ChatInput } from "@/components/marketplace/listings/item/chat/ChatInput";
import { useBeautyChat } from "@/hooks/use-beauty-chat";

interface BeautyChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientId: string;
  type: "marketplace" | "professional";
  title: string;
  listingId?: string;
  professionalId?: string;
}

export const BeautyChatDialog = ({
  open,
  onOpenChange,
  recipientId,
  type,
  title,
  listingId,
  professionalId,
}: BeautyChatDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [chatId, setChatId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!open || !user) return;

    const initializeChat = async () => {
      try {
        // Check for existing chat
        const { data: existingChat } = await supabase
          .from("beauty_chat_rooms")
          .select("id")
          .match({
            [type === "marketplace" ? "listing_id" : "professional_id"]:
              type === "marketplace" ? listingId : professionalId,
            type,
          })
          .single();

        if (existingChat) {
          setChatId(existingChat.id);
          return;
        }

        // Create new chat room
        const { data: newRoom, error: roomError } = await supabase
          .from("beauty_chat_rooms")
          .insert({
            type,
            [type === "marketplace" ? "listing_id" : "professional_id"]:
              type === "marketplace" ? listingId : professionalId,
          })
          .select()
          .single();

        if (roomError) throw roomError;

        // Add participants
        const { error: participantsError } = await supabase
          .from("beauty_chat_participants")
          .insert([
            { room_id: newRoom.id, user_id: user.id },
            { room_id: newRoom.id, user_id: recipientId },
          ]);

        if (participantsError) throw participantsError;

        setChatId(newRoom.id);
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast({
          title: "Error",
          description: "Failed to start chat",
          variant: "destructive",
        });
      }
    };

    initializeChat();
  }, [open, user, type, listingId, professionalId, recipientId]);

  const { messages, isLoading, sendMessage } = useBeautyChat(chatId);

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
          <DialogTitle>{title}</DialogTitle>
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
