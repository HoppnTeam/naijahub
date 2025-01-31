import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { WorkshopMap } from "@/components/workshops/WorkshopMap";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [isLiking, setIsLiking] = useState(false);

  const { data: likeData, refetch: refetchLike } = useQuery({
    queryKey: ['listing-like', listing.id, user?.id],
    queryFn: async () => {
      if (!user) return { isLiked: false, count: 0 };
      
      // Get like status
      const { data: likeStatus } = await supabase
        .from('tech_marketplace_likes')
        .select('id')
        .eq('listing_id', listing.id)
        .eq('user_id', user.id)
        .maybeSingle();

      // Get total likes count
      const { count } = await supabase
        .from('tech_marketplace_likes')
        .select('id', { count: 'exact' })
        .eq('listing_id', listing.id);

      return {
        isLiked: !!likeStatus,
        count: count || 0
      };
    },
    enabled: true,
  });

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to like listings",
        variant: "destructive",
      });
      return;
    }

    setIsLiking(true);
    try {
      if (likeData?.isLiked) {
        await supabase
          .from('tech_marketplace_likes')
          .delete()
          .eq('listing_id', listing.id)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('tech_marketplace_likes')
          .insert({
            listing_id: listing.id,
            user_id: user.id
          });
      }
      await refetchLike();
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    } finally {
      setIsLiking(false);
    }
  };

  const handleClick = () => {
    navigate(`/marketplace/${listing.id}`);
  };

  return (
    <Card className="h-full relative group">
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
          
          <div className="h-48 w-full rounded-lg overflow-hidden">
            <WorkshopMap 
              latitude={6.5244}
              longitude={3.3792}
            />
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-200 md:opacity-0 md:group-hover:opacity-100"
            onClick={handleLikeClick}
            disabled={isLiking}
          >
            <Heart 
              className={cn(
                "w-5 h-5 transition-colors", 
                likeData?.isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
              )} 
            />
            <span className="ml-2 font-medium">
              {likeData?.count || 0}
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};