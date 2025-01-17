import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { CreateComment } from "./comments/CreateComment";
import { CommentCard } from "./comments/CommentCard";
import { CommentsPagination } from "./comments/CommentsPagination";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
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

const COMMENTS_PER_PAGE = 5;

export const CommentsList = ({ comments: initialComments, listingId, onCommentAdded }: CommentsListProps) => {
  const [comments, setComments] = useState<Comment[]>(initialComments || []);
  const [currentPage, setCurrentPage] = useState(1);
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
          } else if (payload.eventType === 'DELETE') {
            setComments(prev => prev.filter(comment => comment.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setComments(prev => 
              prev.map(comment => 
                comment.id === payload.new.id 
                  ? { ...comment, content: payload.new.content }
                  : comment
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [listingId]);

  const totalPages = Math.ceil((comments?.length || 0) / COMMENTS_PER_PAGE);
  const paginatedComments = comments?.slice(
    (currentPage - 1) * COMMENTS_PER_PAGE,
    currentPage * COMMENTS_PER_PAGE
  );

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      {user && (
        <div className="mb-6">
          <CreateComment listingId={listingId} onCommentCreated={onCommentAdded} />
        </div>
      )}
      <div className="space-y-4">
        {paginatedComments?.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            currentUserId={user?.id}
          />
        ))}
      </div>
      <CommentsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};