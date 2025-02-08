
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, MapPin, Sparkles } from "lucide-react";
import type { BeautyProfessional } from "@/types/beauty";

const BeautyProfessionalsDirectory = () => {
  const navigate = useNavigate();

  const { data: professionals, isLoading } = useQuery({
    queryKey: ["beauty-professionals"],
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
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as BeautyProfessional[];
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Beauty Professionals</h1>
          <p className="text-muted-foreground">
            Find and connect with top beauty professionals in your area
          </p>
        </div>
        <Button 
          onClick={() => navigate("/categories/fashion-beauty/beauty-professionals/register")}
          className="bg-[#E2725B] hover:bg-[#E2725B]/90"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Register as Professional
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {professionals?.map((professional) => (
          <Card 
            key={professional.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/categories/fashion-beauty/beauty-professionals/${professional.id}`)}
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{professional.business_name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-1" />
                    {professional.location}
                  </div>
                </div>
                {professional.verified && (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Verified
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="font-medium">{professional.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">
                  ({professional.review_count} reviews)
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {professional.specialties.slice(0, 3).map((specialty, index) => (
                  <span
                    key={index}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                  >
                    {specialty.replace('_', ' ')}
                  </span>
                ))}
                {professional.specialties.length > 3 && (
                  <span className="text-sm text-muted-foreground">
                    +{professional.specialties.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BeautyProfessionalsDirectory;
