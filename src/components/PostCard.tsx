import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    image_url?: string | null;
    created_at: string;
    profiles?: {
      username: string;
      avatar_url?: string | null;
    } | null;
    _count?: {
      comments: number;
      likes: number;
    };
  };
}

export const PostCard = ({ post }: PostCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => navigate(`/posts/${post.id}`)}
    >
      {post.image_url && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-center space-x-4 mb-4">
          <Avatar>
            <AvatarImage src={post.profiles?.avatar_url ?? undefined} />
            <AvatarFallback>
              {post.profiles?.username?.substring(0, 2).toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{post.profiles?.username}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <CardTitle className="line-clamp-2">{post.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-3 mb-4">
          {post.content}
        </p>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>{post._count?.comments || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>{post._count?.likes || 0}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};