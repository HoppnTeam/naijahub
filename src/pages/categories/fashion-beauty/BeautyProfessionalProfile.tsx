
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BeautyProfileHeader } from "@/components/beauty/profile/ProfileHeader";
import { ProfileLoadingSkeleton } from "@/components/beauty/profile/ProfileLoadingSkeleton";
import { ProfileErrorState } from "@/components/beauty/profile/ProfileErrorState";
import { ProfileContent } from "@/components/beauty/profile/ProfileContent";
import { useAuth } from "@/contexts/AuthContext";
import type { BeautyProfessionalService } from "@/types/beauty";

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
      return data;
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
      return data;
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
    document.querySelector('[value="book"]')?.setAttribute('data-state', 'active');
  };

  if (isLoading) {
    return <ProfileLoadingSkeleton />;
  }

  if (!professional) {
    return <ProfileErrorState />;
  }

  const isOwner = user?.id === professional.user_id;

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <BeautyProfileHeader professional={professional} />
      <ProfileContent 
        professional={professional}
        services={services}
        selectedService={selectedService}
        selectedDate={selectedDate}
        selectedStartTime={selectedStartTime}
        selectedEndTime={selectedEndTime}
        isOwner={isOwner}
        isBookingDialogOpen={isBookingDialogOpen}
        onServiceSelect={handleServiceSelect}
        onTimeSlotSelect={handleTimeSlotSelect}
        onBookingDialogClose={() => setIsBookingDialogOpen(false)}
        onProceedBooking={() => setIsBookingDialogOpen(true)}
      />
    </div>
  );
};

export default BeautyProfessionalProfile;
