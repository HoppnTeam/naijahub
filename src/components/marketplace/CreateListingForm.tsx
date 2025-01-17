import { useCreateListing } from "@/hooks/use-create-listing";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/posts/ImageUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { ProductDetailsFields } from "./form/ProductDetailsFields";
import { DeliveryMethodFields } from "./form/DeliveryMethodFields";

interface CreateListingFormProps {
  onSuccess?: () => void;
}

export const CreateListingForm = ({ onSuccess }: CreateListingFormProps) => {
  const { formData, isLoading, handleSubmit } = useCreateListing({ onSuccess });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Listing</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <BasicInfoFields
            title={formData.title}
            setTitle={formData.setTitle}
            description={formData.description}
            setDescription={formData.setDescription}
          />
          
          <ProductDetailsFields
            price={formData.price}
            setPrice={formData.setPrice}
            condition={formData.condition}
            setCondition={formData.setCondition}
            category={formData.category}
            setCategory={formData.setCategory}
            location={formData.location}
            setLocation={formData.setLocation}
          />

          <DeliveryMethodFields
            paymentMethods={formData.paymentMethods}
            setPaymentMethods={formData.setPaymentMethods}
            deliveryMethod={formData.deliveryMethod}
            setDeliveryMethod={formData.setDeliveryMethod}
          />

          <ImageUpload onImagesChange={formData.setSelectedFiles} />
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Listing"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};