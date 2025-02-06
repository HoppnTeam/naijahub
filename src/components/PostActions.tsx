import { Button } from "@/components/ui/button";
import { MessageSquare, ThumbsUp, Share2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { SocialShare } from "./SocialShare";

interface PostActionsProps {
  postId: string;
  initialLikesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  onLikeToggle?: () => void;
}

export const PostActions = ({
  postId,
  initialLikesCount,
  commentsCount,
  isLiked = false,
  onLikeToggle
}: PostActionsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLiking, setIsLiking] = useState(false);
  const [currentIsLiked, setCurrentIsLiked] = useState(isLiked);

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to like posts",
        variant: "destructive",
      });
      return;
    }

    setIsLiking(true);
    try {
      if (currentIsLiked) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
          
        if (error) throw error;
        setLikesCount(prev => prev - 1);
      } else {
        const { error } = await supabase
          .from('likes')
          .insert({
            post_id: postId,
            user_id: user.id
          });
          
        if (error) throw error;
        setLikesCount(prev => prev + 1);
      }
      setCurrentIsLiked(!currentIsLiked);
      onLikeToggle?.();
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        disabled={isLiking}
        className={currentIsLiked ? "text-primary" : ""}
      >
        <ThumbsUp className="h-4 w-4 mr-2" />
        {likesCount}
      </Button>
      <Button variant="ghost" size="sm">
        <MessageSquare className="h-4 w-4 mr-2" />
        {commentsCount}
      </Button>
      <SocialShare title="" url={window.location.href} />
    </div>
  );
};