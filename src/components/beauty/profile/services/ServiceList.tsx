
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import type { BeautyProfessionalService } from "@/types/beauty";

interface ServiceListProps {
  professionalId: string;
  onEdit: (service: BeautyProfessionalService) => void;
  onDelete: (serviceId: string) => void;
}

export const ServiceList = ({ professionalId, onEdit, onDelete }: ServiceListProps) => {
  const { data: services, isLoading } = useQuery({
    queryKey: ["professional-services", professionalId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("beauty_professional_services")
        .select("*")
        .eq("professional_id", professionalId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as BeautyProfessionalService[];
    },
  });

  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-24 bg-gray-100 rounded-lg" />
      ))}
    </div>;
  }

  if (!services?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No services added yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {services.map((service) => (
        <Card key={service.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">{service.service_name}</h3>
                <Badge variant="outline">
                  {service.service_location === "in_store"
                    ? "In-Store Service"
                    : service.service_location === "home_service"
                    ? "Home Service"
                    : "In-Store or Home Service"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                {service.description}
              </p>
              <p className="text-sm">Duration: {service.duration_minutes} minutes</p>
            </div>
            <div className="text-right">
              <p className="font-semibold mb-2">₦{service.price}</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(service)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDelete(service.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
