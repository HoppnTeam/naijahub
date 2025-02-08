
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ListingImage } from "@/components/marketplace/listings/item/ListingImage";
import { ListingImageCarousel } from "@/components/marketplace/listings/item/ListingImageCarousel";
import { 
  Scissors, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Instagram, 
  Star,
  Clock 
} from "lucide-react";

interface Designer {
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
  profiles: {
    username: string;
    avatar_url: string | null;
  } | null;
}

const DesignerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: designer, isLoading } = useQuery({
    queryKey: ["designer", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fashion_designers")
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as Designer;
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
      <Button 
        onClick={() => navigate("/categories/fashion-beauty/designer-directory")}
        variant="outline"
        className="mb-6"
      >
        Back to Directory
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <ProfileAvatar 
                avatarUrl={designer.profiles?.avatar_url} 
                username={designer.profiles?.username}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">{designer.business_name}</CardTitle>
                  {designer.verified && (
                    <Badge variant="secondary" className="ml-2">Verified</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>{designer.location}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">About</h3>
                  <p className="text-muted-foreground">{designer.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {designer.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline">
                        {specialty.replace('_', ' ').toLowerCase()}
                      </Badge>
                    ))}
                  </div>
                </div>

                {designer.years_experience && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{designer.years_experience} years of experience</span>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>{designer.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground">
                      ({designer.review_count} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {designer.portfolio_images.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <ListingImageCarousel 
                  images={designer.portfolio_images}
                  title={designer.business_name}
                />
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {designer.contact_email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <a 
                    href={`mailto:${designer.contact_email}`}
                    className="text-primary hover:underline"
                  >
                    {designer.contact_email}
                  </a>
                </div>
              )}
              
              {designer.contact_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <a 
                    href={`tel:${designer.contact_phone}`}
                    className="text-primary hover:underline"
                  >
                    {designer.contact_phone}
                  </a>
                </div>
              )}

              {designer.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <a 
                    href={designer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              )}

              {designer.instagram_handle && (
                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-muted-foreground" />
                  <a 
                    href={`https://instagram.com/${designer.instagram_handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    @{designer.instagram_handle}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DesignerProfile;
