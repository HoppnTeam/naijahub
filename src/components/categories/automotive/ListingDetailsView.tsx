import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { MapPin, Calendar, MessageSquare, DollarSign, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const ListingDetailsView = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: listing, isLoading } = useQuery({
    queryKey: ["auto_listing", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("auto_marketplace_listings")
        .select(`
          *,
          profiles!auto_marketplace_listings_seller_id_profiles_fkey (
            username,
            avatar_url
          )
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const handleContact = () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to contact sellers",
        variant: "destructive",
      });
      return;
    }
    // Implement contact functionality
    toast({
      title: "Coming soon",
      description: "Contact functionality will be available soon",
    });
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-muted rounded-lg" />
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/4" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold">Listing not found</h1>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4 mb-4">
            <Avatar>
              <AvatarImage src={listing.profiles?.avatar_url ?? undefined} />
              <AvatarFallback>
                {listing.profiles?.username?.substring(0, 2).toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{listing.profiles?.username}</p>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(listing.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          <CardTitle className="text-2xl mb-2">{listing.title}</CardTitle>
          <div className="text-3xl font-bold text-primary">
            ₦{listing.price.toLocaleString()}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {listing.images?.[0] && (
              <div className="aspect-square overflow-hidden rounded-lg">
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="space-y-4">
              <Badge variant="secondary">{listing.condition}</Badge>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{listing.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(listing.created_at).toLocaleDateString()}</span>
                </div>
                {listing.section === "vehicles" && (
                  <>
                    {listing.make && listing.model && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Info className="w-4 h-4" />
                        <span>
                          {listing.make} {listing.model}{" "}
                          {listing.year && `(${listing.year})`}
                        </span>
                      </div>
                    )}
                    {listing.mileage && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Info className="w-4 h-4" />
                        <span>{listing.mileage.toLocaleString()} km</span>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="prose max-w-none">
                <h3>Description</h3>
                <p>{listing.description}</p>
              </div>
              {!listing.is_business && user?.id !== listing.seller_id && (
                <Button onClick={handleContact} className="w-full">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Seller
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};