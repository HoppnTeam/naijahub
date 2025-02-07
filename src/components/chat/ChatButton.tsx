
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { ChatDialog } from "./ChatDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ChatButtonProps {
  recipientId: string;
  recipientName: string;
}

export const ChatButton = ({ recipientId, recipientName }: ChatButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleStartChat = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to start a chat",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get room IDs where current user is a participant
      const { data: userRooms } = await supabase
        .from('chat_participants')
        .select('room_id')
        .eq('user_id', user.id);

      // Get room IDs where recipient is a participant
      const { data: recipientRooms } = await supabase
        .from('chat_participants')
        .select('room_id')
        .eq('user_id', recipientId);

      // Find common direct chat rooms
      const userRoomIds = userRooms?.map(r => r.room_id) || [];
      const recipientRoomIds = recipientRooms?.map(r => r.room_id) || [];

      const { data: existingRoom } = await supabase
        .from('chat_rooms')
        .select('id')
        .eq('type', 'direct')
        .in('id', userRoomIds)
        .in('id', recipientRoomIds)
        .single();

      if (existingRoom) {
        setRoomId(existingRoom.id);
        setIsOpen(true);
        return;
      }

      // Create new chat room
      const { data: newRoom, error: roomError } = await supabase
        .from('chat_rooms')
        .insert({
          type: 'direct',
          name: `${user.id}_${recipientId}`,
        })
        .select()
        .single();

      if (roomError) throw roomError;

      // Add participants
      const { error: participantsError } = await supabase
        .from('chat_participants')
        .insert([
          { room_id: newRoom.id, user_id: user.id },
          { room_id: newRoom.id, user_id: recipientId },
        ]);

      if (participantsError) throw participantsError;

      setRoomId(newRoom.id);
      setIsOpen(true);
    } catch (error) {
      console.error('Error starting chat:', error);
      toast({
        title: "Error",
        description: "Failed to start chat",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleStartChat}
        className="flex items-center gap-2"
      >
        <MessageCircle className="h-4 w-4" />
        Chat
      </Button>

      {roomId && (
        <ChatDialog
          open={isOpen}
          onOpenChange={setIsOpen}
          roomId={roomId}
          title={`Chat with ${recipientName}`}
        />
      )}
    </>
  );
};
