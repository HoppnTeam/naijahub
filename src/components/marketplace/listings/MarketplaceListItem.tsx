import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { WorkshopMap } from "@/components/workshops/WorkshopMap";

interface MarketplaceListItemProps {
  listing: {
    id: string;
    title: string;
    description: string;
    price: number;
    images: string[];
    condition: string;
    location: string;
    profiles?: { username: string };
  };
}

export const MarketplaceListItem = ({ listing }: MarketplaceListItemProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: isLiked, refetch: refetchLike } = useQuery({
    queryKey: ['listing-like', listing.id, user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data } = await supabase
        .from('tech_marketplace_likes')
        .select('id')
        .eq('listing_id', listing.id)
        .eq('user_id', user.id)
        .single();
      return !!data;
    },
    enabled: !!user,
  });

  const handleClick = () => {
    navigate(`/marketplace/${listing.id}`);
  };

  return (
    <Card className="h-full">
      {listing.images && listing.images[0] && (
        <div className="aspect-square w-full overflow-hidden">
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader className="space-y-2">
        <h3 className="font-semibold line-clamp-2">{listing.title}</h3>
        <p className="text-2xl font-bold text-primary">
          {formatCurrency(listing.price)}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {listing.description}
            </p>
            <div className="text-sm text-muted-foreground">
              <p>Location: {listing.location}</p>
              <p>Condition: {listing.condition}</p>
              {listing.profiles?.username && (
                <p>Seller: {listing.profiles.username}</p>
              )}
            </div>
          </div>
          
          {/* Map integration */}
          <div className="h-48 w-full rounded-lg overflow-hidden">
            <WorkshopMap 
              latitude={6.5244} // Default to Lagos coordinates if not provided
              longitude={3.3792}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};