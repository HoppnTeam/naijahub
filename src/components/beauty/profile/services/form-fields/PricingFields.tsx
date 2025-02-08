
import { Input } from "@/components/ui/input";
import type { BeautyProfessionalService } from "@/types/beauty";

interface PricingFieldsProps {
  formData: Partial<BeautyProfessionalService>;
  setFormData: (data: Partial<BeautyProfessionalService>) => void;
}

export const PricingFields = ({ formData, setFormData }: PricingFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Input
          type="number"
          placeholder="Price (₦)"
          value={formData.price || ""}
          onChange={(e) =>
            setFormData({ ...formData, price: parseFloat(e.target.value) })
          }
          required
          min="0"
          step="0.01"
        />
      </div>

      <div>
        <Input
          type="number"
          placeholder="Duration (minutes)"
          value={formData.duration_minutes || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              duration_minutes: parseInt(e.target.value),
            })
          }
          required
          min="1"
        />
      </div>
    </div>
  );
};
