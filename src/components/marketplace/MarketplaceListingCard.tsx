
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Package, MapPin, Clock, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useShoppingCart } from "@/hooks/use-shopping-cart";

interface MarketplaceListingCardProps {
  listing: {
    id: string;
    title: string;
    price: number;
    condition: string;
    location: string;
    images: string[];
    created_at: string;
  };
  onClick: () => void;
  isLiked?: boolean;
  onLikeToggle?: () => void;
}

export const MarketplaceListingCard = ({ 
  listing, 
  onClick,
  isLiked = false,
  onLikeToggle
}: MarketplaceListingCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLiking, setIsLiking] = useState(false);
  const { addToCart } = useShoppingCart();

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
      if (isLiked) {
        const { error } = await supabase
          .from('tech_marketplace_likes')
          .delete()
          .eq('listing_id', listing.id)
          .eq('user_id', user.id);
          
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('tech_marketplace_likes')
          .insert({
            listing_id: listing.id,
            user_id: user.id
          });
          
        if (error) throw error;
      }
      onLikeToggle?.();
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

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    addToCart.mutate({ listingId: listing.id });
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow relative"
      onClick={onClick}
    >
      <div className="aspect-square w-full overflow-hidden">
        <img
          src={listing.images[0] || "/placeholder.svg"}
          alt={listing.title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-2 text-lg">{listing.title}</CardTitle>
        <div className="text-2xl font-bold text-primary">
          {formatCurrency(listing.price)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Badge variant="secondary">{listing.condition}</Badge>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{listing.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{new Date(listing.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex gap-2 absolute top-2 right-2">
            <Button
              variant="ghost"
              size="sm"
              className="bg-background/80 backdrop-blur-sm"
              onClick={handleAddToCart}
              disabled={addToCart.isPending}
            >
              <ShoppingCart className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="bg-background/80 backdrop-blur-sm"
              onClick={handleLikeClick}
              disabled={isLiking}
            >
              <Heart className={cn("w-5 h-5", isLiked ? "fill-current text-red-500" : "")} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
