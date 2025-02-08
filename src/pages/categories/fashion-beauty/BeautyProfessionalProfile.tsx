
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface BeautyProfessional {
  id: string;
  user_id: string;
  business_name: string;
  description: string;
  specialties: string[];
  years_experience: number | null;
  portfolio_images: string[];
  location: string;
  contact_email: string | null;
  contact_phone: string | null;
  instagram_handle: string | null;
  website: string | null;
  rating: number;
  review_count: number;
  verified: boolean;
  professional_type: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  } | null;
}

const BeautyProfessionalProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">About</h2>
                <p className="text-muted-foreground">{professional.description}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">Specialties</h2>
                <div className="flex flex-wrap gap-2">
                  {professional.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                    >
                      {specialty.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {professional.years_experience && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">Experience</h2>
                  <p>{professional.years_experience} years</p>
                </div>
              )}

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
            </div>
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
              <div className="text-2xl font-bold">{professional.rating.toFixed(1)}</div>
              <div className="text-muted-foreground">
                ({professional.review_count} reviews)
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BeautyProfessionalProfile;
