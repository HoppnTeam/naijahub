import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingCalendar } from "@/components/beauty/BookingCalendar";
import { BookingDialog } from "@/components/beauty/BookingDialog";
import { AboutSection } from "@/components/beauty/profile/AboutSection";
import { ServicesSection } from "@/components/beauty/profile/ServicesSection";
import { ContactSection } from "@/components/beauty/profile/ContactSection";
import { RatingsSection } from "@/components/beauty/profile/RatingsSection";
import type { BeautyProfessional, BeautyProfessionalService } from "@/types/beauty";
import { useAuth } from "@/hooks/auth";

const BeautyProfessionalProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedStartTime, setSelectedStartTime] = useState<string>();
  const [selectedEndTime, setSelectedEndTime] = useState<string>();
  const [selectedService, setSelectedService] = useState<BeautyProfessionalService>();
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

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

  const isOwner = user?.id === professional?.user_id;

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
    document.querySelector('[value="book"]')?.setAttribute('data-state', 'active');
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

              <TabsContent value="about">
                <AboutSection professional={professional} />
              </TabsContent>

              <TabsContent value="services">
                {services && (
                  <ServicesSection 
                    professional={professional}
                    services={services}
                    onServiceSelect={handleServiceSelect}
                    isOwner={isOwner}
                  />
                )}
              </TabsContent>

              <TabsContent value="book" className="space-y-6">
                {!selectedService ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Please select a service first
                    </p>
                    <Button
                      onClick={() => document.querySelector('[value="services"]')?.setAttribute('data-state', 'active')}
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
          <ContactSection professional={professional} />
          <RatingsSection professional={professional} />
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
