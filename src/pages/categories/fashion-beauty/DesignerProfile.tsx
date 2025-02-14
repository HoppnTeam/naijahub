import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DesignerHeader } from "./components/DesignerHeader";
import { DesignerInfo } from "./components/DesignerInfo";
import { DesignerContact } from "./components/DesignerContact";
import { DesignerPortfolio } from "./components/DesignerPortfolio";
import { DesignerReviews } from "./components/reviews/DesignerReviews";
import { DesignerLocationMap } from "./components/DesignerLocationMap";
import { BackNavigation } from "@/components/BackNavigation";
import type { Designer } from "@/types/beauty";

const DesignerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: designer, isLoading } = useQuery({
    queryKey: ["designer", id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from("fashion_designers")
        .select(`
          *,
          profiles:user_id(
            username,
            avatar_url
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      if (!data) return null;

      const transformedData: Designer = {
        ...data,
        profiles: data.profiles ? {
          username: data.profiles.username || "Unknown User",
          avatar_url: data.profiles.avatar_url
        } : null
      };

      return transformedData;
    },
  });

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

  if (!designer) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <BackNavigation />
        <h1 className="text-2xl font-bold mb-4">Designer not found</h1>
        <Button 
          onClick={() => navigate("/categories/fashion-beauty/designer-directory")}
          variant="outline"
        >
          Back to Directory
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <BackNavigation />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <DesignerHeader
              businessName={designer.business_name}
              location={designer.location}
              verified={designer.verified}
              avatarUrl={designer.profiles?.avatar_url}
              username={designer.profiles?.username || 'Unknown User'}
            />
            <DesignerInfo
              description={designer.description}
              specialties={designer.specialties}
              yearsExperience={designer.years_experience}
              rating={designer.rating}
              reviewCount={designer.review_count}
            />
          </Card>

          <DesignerPortfolio 
            images={designer.portfolio_images}
            businessName={designer.business_name}
          />

          <DesignerReviews
            designerId={designer.id}
            businessName={designer.business_name}
          />
        </div>

        <div className="space-y-6">
          <Card>
            <DesignerContact
              email={designer.contact_email}
              phone={designer.contact_phone}
              website={designer.website}
              instagramHandle={designer.instagram_handle}
            />
          </Card>

          {designer.latitude && designer.longitude && (
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Location</h3>
              <DesignerLocationMap
                latitude={designer.latitude}
                longitude={designer.longitude}
                businessName={designer.business_name}
              />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesignerProfile;
