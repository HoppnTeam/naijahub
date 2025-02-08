
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { BeautyProfessionalService, ServiceCategory, ServiceLocationType } from "@/types/beauty";

interface ServiceFormProps {
  professionalId: string;
  editingService?: BeautyProfessionalService | null;
  onSubmitted: () => void;
  onCancel: () => void;
}

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

export const ServiceForm = ({
  professionalId,
  editingService,
  onSubmitted,
  onCancel,
}: ServiceFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Partial<BeautyProfessionalService>>(
    editingService || {
      service_name: "",
      description: "",
      price: 0,
      duration_minutes: 30,
      service_location: "in_store" as ServiceLocationType,
      category: "other" as ServiceCategory,
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const serviceData = {
      ...formData,
      professional_id: professionalId,
      price: Number(formData.price),
      duration_minutes: Number(formData.duration_minutes),
    };

    const { error } = editingService
      ? await supabase
          .from("beauty_professional_services")
          .update(serviceData)
          .eq("id", editingService.id)
      : await supabase.from("beauty_professional_services").insert(serviceData);

    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save service. Please try again.",
        variant: "destructive",
      });
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["professional-services"] });
    toast({
      title: `Service ${editingService ? "Updated" : "Added"}`,
      description: `The service has been successfully ${
        editingService ? "updated" : "added"
      }.`,
    });
    onSubmitted();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {editingService ? "Update" : "Add"} Service
        </Button>
      </div>
    </form>
  );
};
