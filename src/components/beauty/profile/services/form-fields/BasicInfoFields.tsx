
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { BeautyProfessionalService } from "@/types/beauty";

interface BasicInfoFieldsProps {
  formData: Partial<BeautyProfessionalService>;
  setFormData: (data: Partial<BeautyProfessionalService>) => void;
}

export const BasicInfoFields = ({ formData, setFormData }: BasicInfoFieldsProps) => {
  return (
    <>
      <div>
        <Input
          placeholder="Service Name"
          value={formData.service_name || ""}
          onChange={(e) =>
            setFormData({ ...formData, service_name: e.target.value })
          }
          required
        />
      </div>

      <div>
        <Textarea
          placeholder="Service Description (optional)"
          value={formData.description || ""}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>
    </>
  );
};
