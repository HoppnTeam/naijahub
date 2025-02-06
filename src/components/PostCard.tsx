import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { SocialShare } from "./SocialShare";
import { FollowButton } from "./FollowButton";
import { useAuth } from "@/contexts/AuthContext";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    created_at: string;
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
  };
}

export const PostCard = ({ post }: PostCardProps) => {
  const { user } = useAuth();
  const postUrl = `${window.location.origin}/posts/${post.id}`;

  // Use either user or profiles data
  const postUser = post.user || { 
    id: post.user_id,
    username: post.profiles?.username || 'Unknown User',
    avatar_url: post.profiles?.avatar_url
  };

  return (
    <Card className="mb-4">
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
        <p className="text-muted-foreground">{post.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <SocialShare title={post.title} url={postUrl} />
      </CardFooter>
    </Card>
  );
};