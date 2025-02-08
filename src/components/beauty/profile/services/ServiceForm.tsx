
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { BasicInfoFields } from "./form-fields/BasicInfoFields";
import { PricingFields } from "./form-fields/PricingFields";
import { CategoryFields } from "./form-fields/CategoryFields";
import type { BeautyProfessionalService, ServiceCategory, ServiceLocationType } from "@/types/beauty";

interface ServiceFormProps {
  professionalId: string;
  editingService?: BeautyProfessionalService | null;
  onSubmitted: () => void;
  onCancel: () => void;
}

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
      service_name: formData.service_name || "",
    };

    const { error } = editingService
      ? await supabase
          .from("beauty_professional_services")
          .update(serviceData)
          .eq("id", editingService.id)
      : await supabase
          .from("beauty_professional_services")
          .insert({
            ...serviceData,
            service_name: serviceData.service_name,
            service_location: serviceData.service_location || "in_store",
            category: serviceData.category || "other",
          });

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
      <BasicInfoFields formData={formData} setFormData={setFormData} />
      <PricingFields formData={formData} setFormData={setFormData} />
      <CategoryFields formData={formData} setFormData={setFormData} />

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
