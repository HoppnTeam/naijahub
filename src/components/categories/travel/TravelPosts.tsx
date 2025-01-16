import { PostCard } from "@/components/PostCard";
import { Post } from "@/types/post";

interface TravelPostsProps {
  posts: Post[] | undefined;
  isLoading: boolean;
}

export const TravelPosts = ({ posts, isLoading }: TravelPostsProps) => {
  if (isLoading) {
    return <div className="text-center py-8">Loading posts...</div>;
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No posts found in this category
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};