
import { format } from "date-fns";
import { Star } from "lucide-react";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer: {
    username: string;
    avatar_url: string | null;
  };
}

interface ReviewsListProps {
  reviews: Review[];
}

export const ReviewsList = ({ reviews }: ReviewsListProps) => {
  if (reviews.length === 0) {
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
              avatarUrl={review.reviewer.avatar_url}
              username={review.reviewer.username}
            />
            <div>
              <div className="font-medium">{review.reviewer.username}</div>
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
