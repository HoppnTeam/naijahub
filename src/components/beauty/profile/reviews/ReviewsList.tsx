
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer: {
    username: string;
    avatar_url: string | null;
  } | null;
}

interface ReviewsListProps {
  professionalId: string;
}

export const ReviewsList = ({ professionalId }: ReviewsListProps) => {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["professional-reviews", professionalId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("beauty_professional_reviews")
        .select(`
          id,
          rating,
          comment,
          created_at,
          reviewer:profiles!reviewer_id(
            username,
            avatar_url
          )
        `)
        .eq("professional_id", professionalId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Review[];
    },
  });

  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
          </div>
        </div>
      ))}
    </div>;
  }

  if (!reviews?.length) {
    return (
      <p className="text-muted-foreground text-center py-4">
        No reviews yet. Be the first to review!
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-6 last:border-b-0">
          <div className="flex items-center gap-2 mb-2">
            <ProfileAvatar
              avatarUrl={review.reviewer?.avatar_url}
              username={review.reviewer?.username}
            />
            <div>
              <div className="font-medium">{review.reviewer?.username}</div>
              <div className="text-sm text-muted-foreground">
                {format(new Date(review.created_at), "MMM d, yyyy")}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={`w-4 h-4 ${
                  index < review.rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>

          {review.comment && <p className="text-muted-foreground">{review.comment}</p>}
        </div>
      ))}
    </div>
  );
};
