import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { BasicInfoFields } from "./BasicInfoFields";
import { ProductDetailsFields } from "./ProductDetailsFields";
import { DeliveryMethodFields } from "./DeliveryMethodFields";
import type { DeliveryMethod, PaymentMethod } from "@/integrations/supabase/types";

export interface ListingFormProps {
  onSubmit: (formData: any) => Promise<void>;
  isLoading?: boolean;
  initialData?: any;
}

export const ListingForm = ({ onSubmit, isLoading, initialData }: ListingFormProps) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [price, setPrice] = useState(initialData?.price?.toString() || "");
  const [condition, setCondition] = useState(initialData?.condition || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(
    initialData?.payment_methods || []
  );
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(
    initialData?.delivery_method || "both"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      title,
      description,
      price: parseFloat(price),
      condition,
      category,
      location,
      payment_methods: paymentMethods,
      delivery_method: deliveryMethod,
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <BasicInfoFields
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
        />

        <ProductDetailsFields
          price={price}
          setPrice={setPrice}
          condition={condition}
          setCondition={setCondition}
          category={category}
          setCategory={setCategory}
          location={location}
          setLocation={setLocation}
        />

        <DeliveryMethodFields
          paymentMethods={paymentMethods}
          setPaymentMethods={setPaymentMethods}
          deliveryMethod={deliveryMethod}
          setDeliveryMethod={setDeliveryMethod}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit Listing"}
        </Button>
      </div>
    </Form>
  );
};