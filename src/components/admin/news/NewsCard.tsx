import { Post } from "@/types/post";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface NewsCardProps {
  post: Post;
  onPublish: (postId: string) => Promise<void>;
}

export const NewsCard = ({ post, onPublish }: NewsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{post.title}</CardTitle>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            {formatDate(post.created_at)}
          </div>
          {post.categories?.name && (
            <Badge variant="secondary">
              {post.categories.name}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{post.content}</p>
        {post.image_url && (
          <img 
            src={post.image_url} 
            alt={post.title}
            className="w-full h-48 object-cover rounded-md mb-4" 
          />
        )}
        {post.source_url && (
          <a 
            href={post.source_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:underline"
          >
            Source Article
          </a>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => onPublish(post.id)}
          className="w-full"
        >
          {post.scheduled_publish_date ? 'Schedule' : 'Publish'} Article
        </Button>
      </CardFooter>
    </Card>
  );
};