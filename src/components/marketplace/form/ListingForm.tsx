import { Button } from "@/components/ui/button";
import { useFormState } from "@/hooks/marketplace/use-form-state";
import { BasicInfoFields } from "./BasicInfoFields";
import { ProductDetailsFields } from "./ProductDetailsFields";
import { DeliveryMethodFields } from "./DeliveryMethodFields";
import { ImageUpload } from "@/components/posts/ImageUpload";
import { useEffect } from "react";

interface ListingFormProps {
  onSubmit: (formData: any) => void;
  isLoading: boolean;
  initialData?: {
    title: string;
    description: string;
    price: number;
    condition: string;
    category: string;
    location: string;
    payment_methods: string[];
    delivery_method: string;
    images: string[];
  };
}

export const ListingForm = ({ onSubmit, isLoading, initialData }: ListingFormProps) => {
  const { formData, setFormData } = useFormState();

  // Populate form with initial data when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        price: initialData.price.toString(),
        condition: initialData.condition,
        category: initialData.category,
        location: initialData.location,
        paymentMethods: initialData.payment_methods,
        deliveryMethod: initialData.delivery_method,
        selectedFiles: initialData.images,
      });
    }
  }, [initialData, setFormData]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit({
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      condition: formData.condition,
      category: formData.category,
      location: formData.location,
      payment_methods: formData.paymentMethods,
      delivery_method: formData.deliveryMethod,
      images: formData.selectedFiles,
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
        existingImages={formData.selectedFiles}
      />
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Saving..." : initialData ? "Update Listing" : "Create Listing"}
      </Button>
    </form>
  );
};