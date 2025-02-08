
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReviewForm } from "./ReviewForm";
import { ReviewsList } from "./ReviewsList";

interface DesignerReviewsProps {
  designerId: string;
  businessName: string;
}

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

export const DesignerReviews = ({ designerId, businessName }: DesignerReviewsProps) => {
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { data: reviews, refetch } = useQuery({
    queryKey: ["designer-reviews", designerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("designer_reviews")
        .select(`
          id,
          rating,
          comment,
          created_at,
          reviewer:profiles!designer_reviews_reviewer_id_fkey(
            username,
            avatar_url
          )
        `)
        .eq("designer_id", designerId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Review[];
    },
  });

  const onReviewSubmitted = () => {
    refetch();
    setShowReviewForm(false);
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Reviews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {user && !showReviewForm && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="text-primary hover:underline"
          >
            Write a Review
          </button>
        )}
        
        {showReviewForm && (
          <ReviewForm 
            designerId={designerId}
            businessName={businessName}
            onSubmitted={onReviewSubmitted}
            onCancel={() => setShowReviewForm(false)}
          />
        )}

        <ReviewsList reviews={reviews || []} />
      </CardContent>
    </Card>
  );
};
