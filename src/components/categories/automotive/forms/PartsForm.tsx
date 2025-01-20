import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BasicInfoFields } from "./parts/BasicInfoFields";
import { CategoryFields } from "./parts/CategoryFields";

interface PartsFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
  initialData?: any;
}

export const PartsForm = ({ onSubmit, isLoading, initialData }: PartsFormProps) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [price, setPrice] = useState(initialData?.price || "");
  const [condition, setCondition] = useState(initialData?.condition || "");
  const [partCategoryId, setPartCategoryId] = useState(initialData?.part_category_id || "");
  const [location, setLocation] = useState(initialData?.location || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      price: parseFloat(price),
      condition,
      part_category_id: partCategoryId,
      location,
      vehicle_type: "parts",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <BasicInfoFields
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        price={price}
        setPrice={setPrice}
        location={location}
        setLocation={setLocation}
      />

      <CategoryFields
        condition={condition}
        setCondition={setCondition}
        partCategoryId={partCategoryId}
        setPartCategoryId={setPartCategoryId}
      />

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Listing"}
      </Button>
    </form>
  );
};