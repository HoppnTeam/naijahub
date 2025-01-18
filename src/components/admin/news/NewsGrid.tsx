import { Loader2 } from "lucide-react";
import { Post } from "@/types/post";
import { NewsCard } from "./NewsCard";

interface NewsGridProps {
  posts?: Post[];
  isLoading: boolean;
  onPublish: (postId: string) => Promise<void>;
}

export const NewsGrid = ({ posts, isLoading, onPublish }: NewsGridProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!posts?.length) {
    return (
      <div className="text-center text-muted-foreground">
        No draft articles found. Click "Fetch New Articles" to get started.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <NewsCard key={post.id} post={post} onPublish={onPublish} />
      ))}
    </div>
  );
};