
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingDialog } from "@/components/beauty/BookingDialog";
import { AboutSection } from "@/components/beauty/profile/AboutSection";
import { ServicesSection } from "@/components/beauty/profile/ServicesSection";
import { ContactSection } from "@/components/beauty/profile/ContactSection";
import { RatingsSection } from "@/components/beauty/profile/RatingsSection";
import { BeautyProfileHeader } from "@/components/beauty/profile/ProfileHeader";
import { BookingSection } from "@/components/beauty/profile/BookingSection";
import type { BeautyProfessional, BeautyProfessionalService } from "@/types/beauty";
import { useAuth } from "@/contexts/AuthContext";

const BeautyProfessionalProfile = () => {
  const { id } = useParams();
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
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <BeautyProfileHeader professional={professional} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="p-6">
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

              <TabsContent value="book">
                <BookingSection 
                  professional={professional}
                  selectedService={selectedService}
                  selectedDate={selectedDate}
                  selectedStartTime={selectedStartTime}
                  selectedEndTime={selectedEndTime}
                  onTimeSlotSelect={handleTimeSlotSelect}
                  onProceedBooking={() => setIsBookingDialogOpen(true)}
                  onViewServices={() => document.querySelector('[value="services"]')?.setAttribute('data-state', 'active')}
                />
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
