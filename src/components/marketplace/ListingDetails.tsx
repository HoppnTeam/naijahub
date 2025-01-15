import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { OrderDialog } from "./listing-details/OrderDialog";
import { ListingInfo } from "./listing-details/ListingInfo";

export const ListingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [showOrderDialog, setShowOrderDialog] = useState(false);

  const { data: listing, isLoading } = useQuery({
    queryKey: ["listing", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tech_marketplace_listings")
        .select(`
          *,
          seller:seller_id (
            username,
            avatar_url
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!listing) {
    return <div>Listing not found</div>;
  }

  return (
    <div className="container max-w-4xl py-8">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{listing.title}</CardTitle>
              <div className="text-3xl font-bold text-primary mt-2">
                {formatCurrency(listing.price)}
              </div>
            </div>
            {user && user.id !== listing.seller_id && (
              <Button onClick={() => setShowOrderDialog(true)}>Buy Now</Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="aspect-square overflow-hidden rounded-lg">
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>
            <ListingInfo listing={listing} />
          </div>
        </CardContent>
      </Card>

      {user && (
        <OrderDialog
          open={showOrderDialog}
          onOpenChange={setShowOrderDialog}
          listing={listing}
          userId={user.id}
        />
      )}
    </div>
  );
};