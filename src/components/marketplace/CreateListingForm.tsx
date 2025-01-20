import { useCreateListing } from "@/hooks/use-create-listing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListingForm } from "./form/ListingForm";

interface CreateListingFormProps {
  onSuccess?: () => void;
}

export const CreateListingForm = ({ onSuccess }: CreateListingFormProps) => {
  const { isLoading, handleSubmit } = useCreateListing({ onSuccess });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Listing</CardTitle>
      </CardHeader>
      <CardContent>
        <ListingForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};