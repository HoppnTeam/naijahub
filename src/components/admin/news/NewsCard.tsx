import { Post } from "@/types/post";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NewsCardProps {
  post: Post;
  onPublish: (postId: string) => Promise<void>;
}

export const NewsCard = ({ post, onPublish }: NewsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{post.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground">{post.content}</p>
          {post.image_url && (
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-48 object-cover rounded-md"
            />
          )}
          <div className="flex justify-end gap-4">
            {post.source_url && (
              <Button
                variant="outline"
                onClick={() => window.open(post.source_url, "_blank")}
              >
                View Original
              </Button>
            )}
            <Button onClick={() => onPublish(post.id)}>
              Publish Article
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};