
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BeautyProfileHeader } from "@/components/beauty/profile/ProfileHeader";
import { ProfileLoadingSkeleton } from "@/components/beauty/profile/ProfileLoadingSkeleton";
import { ProfileErrorState } from "@/components/beauty/profile/ProfileErrorState";
import { ProfileContent } from "@/components/beauty/profile/ProfileContent";
import { BusinessDashboard } from "@/components/beauty/dashboard/BusinessDashboard";
import { useAuth } from "@/contexts/AuthContext";
import type { BeautyProfessional, BeautyProfessionalService } from "@/types/beauty";

const BeautyProfessionalProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
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
      return data as BeautyProfessional;
    },
  });

  const { data: services } = useQuery({
    queryKey: ["beauty-professional-services", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("beauty_professional_services")
        .select("*")
        .eq("professional_id", id);

      if (error) throw error;
      return data as BeautyProfessionalService[];
    },
    enabled: !!professional,
  });

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
      {isOwner ? (
        <div className="mt-8">
          <BusinessDashboard />
        </div>
      ) : (
        <ProfileContent 
          professional={professional}
          services={services || []}
          selectedService={selectedService}
          isOwner={isOwner}
          isBookingDialogOpen={isBookingDialogOpen}
          onServiceSelect={setSelectedService}
          onBookingDialogClose={() => setIsBookingDialogOpen(false)}
          onProceedBooking={() => setIsBookingDialogOpen(true)}
        />
      )}
    </div>
  );
};

export default BeautyProfessionalProfile;
