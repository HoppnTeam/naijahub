
import { Card } from "@/components/ui/card";
import { BeautyProfessional } from "@/types/beauty";

interface RatingsSectionProps {
  professional: BeautyProfessional;
}

export const RatingsSection = ({ professional }: RatingsSectionProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Ratings & Reviews</h2>
      <div className="flex items-center gap-2">
        <div className="text-2xl font-bold">{professional.rating?.toFixed(1)}</div>
        <div className="text-muted-foreground">
          ({professional.review_count} reviews)
        </div>
      </div>
    </Card>
  );
};
