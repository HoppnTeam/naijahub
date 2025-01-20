import { Button } from "@/components/ui/button";
import { useFormState } from "@/hooks/marketplace/use-form-state";
import { BasicInfoFields } from "./BasicInfoFields";
import { ProductDetailsFields } from "./ProductDetailsFields";
import { DeliveryMethodFields } from "./DeliveryMethodFields";
import { ImageUpload } from "@/components/posts/ImageUpload";

interface ListingFormProps {
  onSubmit: (formData: any) => void;
  isLoading: boolean;
}

export const ListingForm = ({ onSubmit, isLoading }: ListingFormProps) => {
  const { formData } = useFormState();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit({
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      condition: formData.condition,
      category: formData.category,
      location: formData.location,
      paymentMethods: formData.paymentMethods,
      deliveryMethod: formData.deliveryMethod,
      selectedFiles: formData.selectedFiles,
    });
  };

  return (
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

      <ImageUpload 
        onImagesChange={formData.setSelectedFiles}
        multiple
      />
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Listing"}
      </Button>
    </form>
  );
};