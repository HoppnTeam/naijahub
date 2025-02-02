import { Button } from "@/components/ui/button";
import { MessageSquare, ThumbsUp } from "lucide-react";

interface PostActionsProps {
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  onLike: () => void;
}

export const PostActions = ({
  likesCount,
  commentsCount,
  isLiked,
  onLike,
}: PostActionsProps) => {
  return (
    <div className="flex justify-between mt-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={onLike}
        className={isLiked ? "text-primary" : ""}
      >
        <ThumbsUp className="mr-2 h-4 w-4" />
        {likesCount}
      </Button>
      <Button variant="ghost" size="sm">
        <MessageSquare className="mr-2 h-4 w-4" />
        {commentsCount}
      </Button>
    </div>
  );
};