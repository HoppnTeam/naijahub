
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash } from "lucide-react";
import { ServiceForm } from "./ServiceForm";
import { ServiceList } from "./ServiceList";
import type { BeautyProfessionalService } from "@/types/beauty";

interface ServiceManagementProps {
  professionalId: string;
}

export const ServiceManagement = ({ professionalId }: ServiceManagementProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<BeautyProfessionalService | null>(null);

  const handleDelete = async (serviceId: string) => {
    const { error } = await supabase
      .from("beauty_professional_services")
      .delete()
      .eq("id", serviceId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete service. Please try again.",
        variant: "destructive",
      });
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["professional-services"] });
    toast({
      title: "Service Deleted",
      description: "The service has been successfully removed.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Manage Services</h2>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        )}
      </div>

      {showForm && (
        <ServiceForm
          professionalId={professionalId}
          editingService={editingService}
          onSubmitted={() => {
            setShowForm(false);
            setEditingService(null);
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingService(null);
          }}
        />
      )}

      <ServiceList
        professionalId={professionalId}
        onEdit={(service) => {
          setEditingService(service);
          setShowForm(true);
        }}
        onDelete={handleDelete}
      />
    </div>
  );
};
