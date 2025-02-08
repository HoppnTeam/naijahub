
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage, ChatRoom } from '@/types/chat';
import { useToast } from './use-toast';

export const useChat = (roomId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !roomId) return;

    // Fetch initial messages and participants
    const fetchChatData = async () => {
      try {
        // Fetch messages
        const { data: messagesData, error: messagesError } = await supabase
          .from('chat_messages')
          .select('*, sender:sender_id(username)')
          .eq('room_id', roomId)
          .order('created_at', { ascending: true });

        if (messagesError) throw messagesError;
        setMessages(messagesData || []);

        // Fetch participants
        const { data: participantsData, error: participantsError } = await supabase
          .from('chat_participants')
          .select('*, user:user_id(username, avatar_url)')
          .eq('room_id', roomId);

        if (participantsError) throw participantsError;
        setParticipants(participantsData || []);
      } catch (error) {
        console.error('Error fetching chat data:', error);
        toast({
          title: "Error",
          description: "Failed to load chat",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatData();

    // Subscribe to new messages
    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    // Update last read timestamp
    const updateLastRead = async () => {
      await supabase
        .from('chat_participants')
        .update({ last_read_at: new Date().toISOString() })
        .eq('room_id', roomId)
        .eq('user_id', user.id);
    };

    updateLastRead();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, roomId, toast]);

  const sendMessage = async (content: string) => {
    if (!user || !content.trim()) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          room_id: roomId,
          sender_id: user.id,
          content: content.trim(),
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  return {
    messages,
    participants,
    isLoading,
    sendMessage,
  };
};

export const useCreateChat = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const createDirectChat = async (recipientId: string) => {
    if (!user) return null;

    try {
      // Check for existing chat
      const { data: existingRooms } = await supabase
        .from('chat_participants')
        .select('room_id')
        .eq('user_id', user.id);

      const existingRoomIds = existingRooms?.map(r => r.room_id) || [];

      const { data: existingChat } = await supabase
        .from('chat_participants')
        .select('room_id')
        .eq('user_id', recipientId)
        .in('room_id', existingRoomIds)
        .single();

      if (existingChat) {
        return existingChat.room_id;
      }

      // Create new chat room
      const { data: room, error: roomError } = await supabase
        .from('chat_rooms')
        .insert({ type: 'direct' })
        .select()
        .single();

      if (roomError) throw roomError;

      // Add participants
      const { error: participantsError } = await supabase
        .from('chat_participants')
        .insert([
          { room_id: room.id, user_id: user.id },
          { room_id: room.id, user_id: recipientId }
        ]);

      if (participantsError) throw participantsError;

      return room.id;
    } catch (error) {
      console.error('Error creating chat:', error);
      toast({
        title: "Error",
        description: "Failed to create chat",
        variant: "destructive"
      });
      return null;
    }
  };

  return { createDirectChat };
};
