
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BeautyProfessionalService, ServiceCategory, ServiceLocationType } from "@/types/beauty";

const SERVICE_CATEGORIES: ServiceCategory[] = [
  "hair_styling",
  "makeup",
  "nail_care",
  "skincare",
  "massage",
  "facial",
  "waxing",
  "lash_extensions",
  "microblading",
  "other",
];

const SERVICE_LOCATIONS: { value: ServiceLocationType; label: string }[] = [
  { value: "in_store", label: "In-Store Service" },
  { value: "home_service", label: "Home Service" },
  { value: "both", label: "Both In-Store and Home Service" },
];

interface CategoryFieldsProps {
  formData: Partial<BeautyProfessionalService>;
  setFormData: (data: Partial<BeautyProfessionalService>) => void;
}

export const CategoryFields = ({ formData, setFormData }: CategoryFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Select
        value={formData.category}
        onValueChange={(value: ServiceCategory) =>
          setFormData({ ...formData, category: value })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent>
          {SERVICE_CATEGORIES.map((category) => (
            <SelectItem key={category} value={category}>
              {category.replace("_", " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={formData.service_location}
        onValueChange={(value: ServiceLocationType) =>
          setFormData({ ...formData, service_location: value })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Service Location" />
        </SelectTrigger>
        <SelectContent>
          {SERVICE_LOCATIONS.map((location) => (
            <SelectItem key={location.value} value={location.value}>
              {location.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
