
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BeautyProfessional } from "@/types/beauty";
import { Star } from "lucide-react";
import { ReviewsList } from "./reviews/ReviewsList";
import { ReviewForm } from "./reviews/ReviewForm";

interface RatingsSectionProps {
  professional: BeautyProfessional;
}

export const RatingsSection = ({ professional }: RatingsSectionProps) => {
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Ratings & Reviews</h2>
        {user && !showReviewForm && (
          <Button
            variant="outline"
            onClick={() => setShowReviewForm(true)}
          >
            Write a Review
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 mb-6">
        <div className="text-2xl font-bold">{professional.rating?.toFixed(1)}</div>
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < Math.floor(professional.rating || 0)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <div className="text-muted-foreground">
          ({professional.review_count} reviews)
        </div>
      </div>

      {showReviewForm && (
        <ReviewForm
          professionalId={professional.id}
          businessName={professional.business_name}
          onSubmitted={() => setShowReviewForm(false)}
          onCancel={() => setShowReviewForm(false)}
        />
      )}

      <ReviewsList professionalId={professional.id} />
    </Card>
  );
};
