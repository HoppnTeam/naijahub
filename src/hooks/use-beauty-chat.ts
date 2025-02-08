
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface BeautyChatMessage {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

export const useBeautyChat = (roomId: string | null) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<BeautyChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!roomId) return;

    const channel = supabase
      .channel(`beauty-chat-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "beauty_chat_messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const newMessage = payload.new as BeautyChatMessage;
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from("beauty_chat_messages")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error loading messages:", error);
        return;
      }

      if (data) {
        setMessages(data);
      }
    };

    loadMessages();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  const sendMessage = async (content: string) => {
    if (!roomId || !content.trim() || !user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.from("beauty_chat_messages").insert({
        room_id: roomId,
        sender_id: user.id,
        content: content.trim(),
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, sendMessage };
};
