import { Post } from "@/types/post";
import { PostCard } from "@/components/PostCard";

interface CulturePostGridProps {
  posts: Post[] | undefined;
}

export const CulturePostGrid = ({ posts }: CulturePostGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts?.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};