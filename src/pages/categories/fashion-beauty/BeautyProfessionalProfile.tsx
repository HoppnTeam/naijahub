
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingCalendar } from "@/components/beauty/BookingCalendar";
import { BookingDialog } from "@/components/beauty/BookingDialog";
import { Badge } from "@/components/ui/badge";
import type { BeautyProfessional, BeautyProfessionalService, ServiceCategory } from "@/types/beauty";

const BeautyProfessionalProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedStartTime, setSelectedStartTime] = useState<string>();
  const [selectedEndTime, setSelectedEndTime] = useState<string>();
  const [selectedService, setSelectedService] = useState<BeautyProfessionalService>();
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');

  const { data: professional, isLoading } = useQuery({
    queryKey: ["beauty-professional", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("beauty_professional_portfolios")
        .select(`
          *,
          profiles:user_id(
            username,
            avatar_url
          )
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      return data as BeautyProfessional;
    },
  });

  const { data: services } = useQuery({
    queryKey: ["professional-services", id],
    enabled: !!professional,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("beauty_professional_services")
        .select("*")
        .eq("professional_id", id);

      if (error) throw error;
      return data as BeautyProfessionalService[];
    },
  });

  const handleTimeSlotSelect = (date: Date, startTime: string, endTime: string) => {
    setSelectedDate(date);
    setSelectedStartTime(startTime);
    setSelectedEndTime(endTime);
  };

  const handleServiceSelect = (service: BeautyProfessionalService) => {
    setSelectedService(service);
    setSelectedDate(undefined);
    setSelectedStartTime(undefined);
    setSelectedEndTime(undefined);
  };

  const serviceCategories = services 
    ? Array.from(new Set(services.map(s => s.category)))
    : [];

  const filteredServices = services?.filter(service => 
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

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        </div>
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Professional not found</h1>
        <Button 
          onClick={() => navigate("/categories/fashion-beauty/beauty-professionals")}
          variant="outline"
        >
          Back to Directory
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Button 
        onClick={() => navigate("/categories/fashion-beauty/beauty-professionals")}
        variant="outline"
        className="mb-6"
      >
        Back to Directory
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">{professional.business_name}</h1>
                <p className="text-muted-foreground">{professional.location}</p>
              </div>
              {professional.verified && (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Verified
                </span>
              )}
            </div>

            <Tabs defaultValue="about" className="w-full">
              <TabsList>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="book">Book Appointment</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-2">About</h2>
                  <p className="text-muted-foreground">{professional.description}</p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2">Specialties</h2>
                  <div className="flex flex-wrap gap-2">
                    {professional.specialties?.map((specialty, index) => (
                      <span
                        key={index}
                        className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                      >
                        {specialty.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                {professional.portfolio_images && professional.portfolio_images.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-2">Portfolio</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {professional.portfolio_images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Portfolio ${index + 1}`}
                          className="rounded-lg object-cover w-full h-48"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="services" className="space-y-4">
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
                          onClick={() => {
                            handleServiceSelect(service);
                            document.querySelector('[value="book"]')?.click();
                          }}
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="book" className="space-y-6">
                {!selectedService ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Please select a service first
                    </p>
                    <Button
                      onClick={() => document.querySelector('[value="services"]')?.click()}
                    >
                      View Services
                    </Button>
                  </div>
                ) : (
                  <>
                    <Card className="p-4">
                      <h3 className="font-semibold mb-2">Selected Service</h3>
                      <div className="flex items-center gap-2 mb-1">
                        <p>{selectedService.service_name} - ₦{selectedService.price}</p>
                        <Badge variant="outline">
                          {getServiceLocationLabel(selectedService.service_location)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Duration: {selectedService.duration_minutes} minutes
                      </p>
                    </Card>

                    <BookingCalendar
                      professionalId={professional.id}
                      onTimeSlotSelect={handleTimeSlotSelect}
                    />

                    {selectedDate && selectedStartTime && selectedEndTime && (
                      <div className="flex justify-center">
                        <Button
                          size="lg"
                          onClick={() => setIsBookingDialogOpen(true)}
                        >
                          Proceed with Booking
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              {professional.contact_email && (
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">{professional.contact_email}</p>
                </div>
              )}
              {professional.contact_phone && (
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-muted-foreground">{professional.contact_phone}</p>
                </div>
              )}
              {professional.website && (
                <div>
                  <p className="font-medium">Website</p>
                  <a
                    href={professional.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              )}
              {professional.instagram_handle && (
                <div>
                  <p className="font-medium">Instagram</p>
                  <a
                    href={`https://instagram.com/${professional.instagram_handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    @{professional.instagram_handle}
                  </a>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Ratings & Reviews</h2>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{professional.rating?.toFixed(1)}</div>
              <div className="text-muted-foreground">
                ({professional.review_count} reviews)
              </div>
            </div>
          </Card>
        </div>
      </div>

      {selectedService && (
        <BookingDialog
          isOpen={isBookingDialogOpen}
          onClose={() => setIsBookingDialogOpen(false)}
          professional={professional}
          selectedDate={selectedDate}
          selectedStartTime={selectedStartTime}
          selectedEndTime={selectedEndTime}
          service={selectedService}
        />
      )}
    </div>
  );
};

export default BeautyProfessionalProfile;
