import { Button } from "@/components/ui/button";
import { CreateListingForm } from "../forms/CreateListingForm";

interface CreateListingViewProps {
  onBack: () => void;
}

export const CreateListingView = ({ onBack }: CreateListingViewProps) => {
  return (
    <div className="container mx-auto px-4 py-6">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="mb-6"
      >
        Back to Listings
      </Button>
      <CreateListingForm />
    </div>
  );
};