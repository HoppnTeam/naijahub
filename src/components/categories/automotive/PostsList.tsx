import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { Post } from "@/types/post";

interface PostsListProps {
  posts?: Post[];
  searchQuery: string;
}

export const PostsList = ({ posts, searchQuery }: PostsListProps) => {
  if (!posts?.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <AlertTriangle className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-lg font-semibold text-center">No posts found</p>
          <p className="text-muted-foreground text-center">
            {searchQuery 
              ? "Try adjusting your search terms"
              : "Be the first to create a post in this category"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};