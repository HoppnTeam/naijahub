import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { CreateComment } from "./comments/CreateComment";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();
  const { toast } = useToast();

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

  const handleEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const handleSaveEdit = async (commentId: string) => {
    if (!editContent.trim()) return;

    try {
      const { error } = await supabase
        .from('auto_marketplace_comments')
        .update({ content: editContent })
        .eq('id', commentId);

      if (error) throw error;

      setEditingId(null);
      setEditContent("");
      toast({
        title: "Comment updated",
        description: "Your comment has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update comment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('auto_marketplace_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      toast({
        title: "Comment deleted",
        description: "Your comment has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete comment. Please try again.",
        variant: "destructive",
      });
    }
  };

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
          <Card key={comment.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
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
                {user?.id === comment.user_id && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(comment)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(comment.id)}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {editingId === comment.id ? (
                <div className="space-y-2">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleSaveEdit(comment.id)}
                      disabled={!editContent.trim()}
                    >
                      Save
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p>{comment.content}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};