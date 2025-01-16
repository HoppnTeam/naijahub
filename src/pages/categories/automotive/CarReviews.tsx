import { BackNavigation } from "@/components/BackNavigation";
import { CarReviewsList } from "@/components/categories/automotive/CarReviewsList";

const CarReviews = () => {
  return (
    <div className="container mx-auto py-8">
      <BackNavigation />
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Car Reviews</h1>
        <CarReviewsList />
      </div>
    </div>
  );
};

export default CarReviews;