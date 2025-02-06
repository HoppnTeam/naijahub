import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { PostActions } from "./PostActions";
import { FollowButton } from "./FollowButton";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    created_at: string;
    image_url?: string;
    user_id?: string;
    user?: {
      id: string;
      username: string;
      avatar_url?: string;
    };
    profiles?: {
      username: string;
      avatar_url?: string;
    };
    _count?: {
      likes: number;
      comments: number;
    };
  };
}

export const PostCard = ({ post }: PostCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const postUrl = `${window.location.origin}/posts/${post.id}`;

  // Use either user or profiles data
  const postUser = post.user || { 
    id: post.user_id,
    username: post.profiles?.username || 'Unknown User',
    avatar_url: post.profiles?.avatar_url
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on buttons or links
    if (
      (e.target as HTMLElement).tagName === 'BUTTON' ||
      (e.target as HTMLElement).closest('button') ||
      (e.target as HTMLElement).tagName === 'A' ||
      (e.target as HTMLElement).closest('a')
    ) {
      return;
    }
    navigate(`/posts/${post.id}`);
  };

  return (
    <Card className="mb-4 cursor-pointer hover:shadow-md transition-shadow" onClick={handleCardClick}>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-2">
              <AvatarImage src={postUser.avatar_url || undefined} />
              <AvatarFallback>
                {postUser.username?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{postUser.username}</p>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          {user && user.id !== postUser.id && (
            <FollowButton targetUserId={postUser.id} />
          )}
        </div>
        <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
        {post.image_url && (
          <div className="mb-4">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-48 object-cover rounded-md"
            />
          </div>
        )}
        <p className="text-muted-foreground">{post.content}</p>
      </CardContent>
      <CardFooter>
        <PostActions
          postId={post.id}
          initialLikesCount={post._count?.likes || 0}
          commentsCount={post._count?.comments || 0}
        />
      </CardFooter>
    </Card>
  );
};