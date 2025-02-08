
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BeautyProfessional, BeautyProfessionalService, ServiceCategory } from "@/types/beauty";
import { ServiceManagement } from "./services/ServiceManagement";

interface ServicesSectionProps {
  professional: BeautyProfessional;
  services: BeautyProfessionalService[];
  onServiceSelect: (service: BeautyProfessionalService) => void;
  isOwner?: boolean;
}

export const ServicesSection = ({ 
  professional, 
  services, 
  onServiceSelect,
  isOwner = false 
}: ServicesSectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');

  const serviceCategories = Array.from(new Set(services.map(s => s.category)));

  const filteredServices = services.filter(service => 
    selectedCategory === 'all' || service.category === selectedCategory
  );

  const getServiceLocationLabel = (location: string) => {
    switch (location) {
      case 'in_store':
        return 'In-Store Service';
      case 'home_service':
        return 'Home Service';
      case 'both':
        return 'In-Store or Home Service Available';
      default:
        return location;
    }
  };

  return (
    <div className="space-y-4">
      {isOwner ? (
        <ServiceManagement professionalId={professional.id} />
      ) : (
        <>
          <div className="flex gap-2 mb-4">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
            >
              All Services
            </Button>
            {serviceCategories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
              >
                {category.replace('_', ' ')}
              </Button>
            ))}
          </div>

          {filteredServices?.map((service) => (
            <Card key={service.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{service.service_name}</h3>
                    <Badge variant="outline">
                      {getServiceLocationLabel(service.service_location)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {service.description}
                  </p>
                  <p className="text-sm">Duration: {service.duration_minutes} minutes</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold mb-2">₦{service.price}</p>
                  <Button 
                    size="sm" 
                    onClick={() => onServiceSelect(service)}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </>
      )}
    </div>
  );
};
