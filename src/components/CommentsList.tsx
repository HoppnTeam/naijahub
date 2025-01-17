import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { CreateComment } from "./comments/CreateComment";
import { useAuth } from "@/contexts/AuthContext";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles?: {
    username?: string;
    avatar_url?: string;
  };
}

interface CommentsListProps {
  comments?: Comment[];
  listingId: string;
  onCommentAdded?: () => void;
}

export const CommentsList = ({ comments: initialComments, listingId, onCommentAdded }: CommentsListProps) => {
  const [comments, setComments] = useState<Comment[]>(initialComments || []);
  const { user } = useAuth();

  useEffect(() => {
    setComments(initialComments || []);
  }, [initialComments]);

  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'auto_marketplace_comments',
          filter: `listing_id=eq.${listingId}`,
        },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            const { data: newComment } = await supabase
              .from('auto_marketplace_comments')
              .select(`
                *,
                profiles (
                  username,
                  avatar_url
                )
              `)
              .eq('id', payload.new.id)
              .single();

            if (newComment) {
              setComments(prev => [newComment, ...prev]);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [listingId]);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      {user && (
        <div className="mb-6">
          <CreateComment listingId={listingId} onCommentCreated={onCommentAdded} />
        </div>
      )}
      <div className="space-y-4">
        {comments?.map((comment) => (
          <Card key={comment.id}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={comment.profiles?.avatar_url ?? undefined} />
                  <AvatarFallback>
                    {comment.profiles?.username?.substring(0, 2).toUpperCase() ??
                      "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{comment.profiles?.username}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p>{comment.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};