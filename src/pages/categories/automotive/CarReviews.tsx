import { BackNavigation } from "@/components/BackNavigation";
import { CarReviewsList } from "@/components/categories/automotive/CarReviewsList";
import { Navigation } from "@/components/Navigation";

const CarReviews = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto py-8 px-4">
        <BackNavigation />
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Car Reviews</h1>
          <CarReviewsList />
        </div>
      </div>
    </div>
  );
};

export default CarReviews;