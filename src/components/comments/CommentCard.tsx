import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CommentCardProps {
  comment: {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    profiles?: {
      username?: string;
      avatar_url?: string;
    };
  };
  currentUserId?: string;
}

export const CommentCard = ({ comment, currentUserId }: CommentCardProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const { toast } = useToast();

  const handleEdit = () => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;

    try {
      const { error } = await supabase
        .from('auto_marketplace_comments')
        .update({ content: editContent })
        .eq('id', comment.id);

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

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('auto_marketplace_comments')
        .delete()
        .eq('id', comment.id);

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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={comment.profiles?.avatar_url ?? undefined} />
              <AvatarFallback>
                {comment.profiles?.username?.substring(0, 2).toUpperCase() ?? "U"}
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
          {currentUserId === comment.user_id && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
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
                onClick={handleSaveEdit}
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
  );
};