import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageSquare, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Post } from "@/types/post";
import { Link } from "react-router-dom";

interface ProfilePostsProps {
  posts: Post[];
}

export const ProfilePosts = ({ posts }: ProfilePostsProps) => {
  if (!posts || posts.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No posts yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="hover:bg-muted/50 transition-colors">
          <CardHeader>
            <div className="flex justify-between items-start mb-2">
              <Link to={`/posts/${post.id}`} className="hover:text-primary">
                <h3 className="text-xl font-semibold">{post.title}</h3>
              </Link>
              {post.categories?.name && (
                <Badge variant="secondary">
                  {post.categories.name}
                </Badge>
              )}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {post.content.substring(0, 200)}
              {post.content.length > 200 ? "..." : ""}
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="sm">
                <ThumbsUp className="mr-2 h-4 w-4" />
                {post._count?.likes || 0}
              </Button>
              <Button variant="ghost" size="sm">
                <MessageSquare className="mr-2 h-4 w-4" />
                {post._count?.comments || 0}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};