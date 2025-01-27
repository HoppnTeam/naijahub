import { Post } from "@/types/post";
import { PersonalAdCard } from "./PersonalAdCard";

interface PersonalAdsGridProps {
  posts?: Post[];
}

export const PersonalAdsGrid = ({ posts }: PersonalAdsGridProps) => {
  if (!posts?.length) {
    return (
      <div className="text-center text-muted-foreground">
        No personal ads found. Be the first to create one!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PersonalAdCard key={post.id} post={post} />
      ))}
    </div>
  );
};