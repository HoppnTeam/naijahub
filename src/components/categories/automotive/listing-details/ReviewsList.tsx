import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ReviewsListProps {
  listingId: string;
}

export const ReviewsList = ({ listingId }: ReviewsListProps) => {
  const { data: reviews } = useQuery({
    queryKey: ["listing_reviews", listingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("auto_marketplace_reviews")
        .select(`
          *,
          profiles!auto_marketplace_reviews_reviewer_id_fkey (
            username,
            avatar_url
          )
        `)
        .eq("listing_id", listingId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (!reviews?.length) {
    return <p className="text-muted-foreground">No reviews yet</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="border rounded-lg p-4">
          <div className="flex items-center gap-4 mb-2">
            <Avatar>
              <AvatarImage src={review.profiles?.avatar_url ?? undefined} />
              <AvatarFallback>
                {review.profiles?.username?.substring(0, 2).toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{review.profiles?.username}</p>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(review.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          <div className="flex gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <StarIcon
                key={index}
                className={`w-4 h-4 ${
                  index < review.rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          {review.comment && <p className="text-sm">{review.comment}</p>}
        </div>
      ))}
    </div>
  );
};