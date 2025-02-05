import { ImageUpload } from "@/components/posts/ImageUpload";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { BasicInfoFields } from "./BasicInfoFields";
import { DeliveryMethodFields } from "./DeliveryMethodFields";
import { ProductDetailsFields } from "./ProductDetailsFields";

interface ListingFormProps {
  formData: {
    title: string;
    setTitle: (value: string) => void;
    description: string;
    setDescription: (value: string) => void;
    price: string;
    setPrice: (value: string) => void;
    condition: string;
    setCondition: (value: string) => void;
    category: string;
    setCategory: (value: string) => void;
    location: string;
    setLocation: (value: string) => void;
    paymentMethods: string[];
    setPaymentMethods: (value: string[]) => void;
    deliveryMethod: string;
    setDeliveryMethod: (value: string) => void;
    selectedFiles: File[];
    setSelectedFiles: (value: File[]) => void;
  };
}

export const ListingForm = ({ formData }: ListingFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Submission logic here
      toast({
        title: "Success",
        description: "Your listing has been created successfully.",
      });
    } catch (error) {
      console.error("Error creating listing:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create listing. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className="space-y-8">
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
        />

        <ImageUpload
          onImagesChange={formData.setSelectedFiles}
          multiple={true}
        />

        <DeliveryMethodFields
          location={formData.location}
          setLocation={formData.setLocation}
          paymentMethods={formData.paymentMethods}
          setPaymentMethods={formData.setPaymentMethods}
          deliveryMethod={formData.deliveryMethod}
          setDeliveryMethod={formData.setDeliveryMethod}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Listing"}
        </Button>
      </div>
    </Form>
  );
};