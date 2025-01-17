import { ReviewForm } from "./ReviewForm";
import { ReviewsList } from "./ReviewsList";
import { useAuth } from "@/contexts/AuthContext";

interface ListingReviewsProps {
  listingId: string;
  sellerId: string;
  onReviewSubmitted: () => void;
}

export const ListingReviews = ({ listingId, sellerId, onReviewSubmitted }: ListingReviewsProps) => {
  const { user } = useAuth();
  const canReview = user && user.id !== sellerId;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Reviews</h3>
      {canReview && (
        <ReviewForm
          listingId={listingId}
          sellerId={sellerId}
          onReviewSubmitted={onReviewSubmitted}
        />
      )}
      <ReviewsList listingId={listingId} />
    </div>
  );
};