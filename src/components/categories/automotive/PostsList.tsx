import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { Post } from "@/types/post";
import { MarketplaceListingCard } from "@/components/marketplace/MarketplaceListingCard";

interface PostsListProps {
  posts?: Post[];
  listings?: any[];
  searchQuery: string;
  section?: 'vehicles' | 'parts' | null;
}

export const PostsList = ({ posts, listings, searchQuery, section }: PostsListProps) => {
  if (section && listings?.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <AlertTriangle className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-lg font-semibold text-center">No listings found</p>
          <p className="text-muted-foreground text-center">
            {searchQuery 
              ? "Try adjusting your search terms"
              : `Be the first to create a listing in this ${section} section`}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!section && !posts?.length) {
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
      {section ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings?.map((listing) => (
            <MarketplaceListingCard
              key={listing.id}
              listing={listing}
              onClick={() => {}} // We'll implement this in the next iteration
            />
          ))}
        </div>
      ) : (
        posts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))
      )}
    </div>
  );
};