
export interface ChatRoom {
  id: string;
  name: string | null;
  type: 'direct' | 'group';
  created_at: string;
  updated_at: string;
}

export interface ChatParticipant {
  id: string;
  room_id: string;
  user_id: string;
  joined_at: string;
  last_read_at: string;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}
