import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { Package, MapPin, Clock, User, Phone, Mail } from "lucide-react";

export const ListingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cash_on_delivery" | "in_person">("online");
  const [deliveryMethod, setDeliveryMethod] = useState<"shipping" | "pickup" | "both">("shipping");
  const [shippingAddress, setShippingAddress] = useState("");

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

  const handleCreateOrder = async () => {
    if (!user || !listing) return;

    try {
      const { error } = await supabase
        .from("tech_marketplace_orders")
        .insert({
          listing_id: listing.id,
          buyer_id: user.id,
          seller_id: listing.seller_id,
          payment_method: paymentMethod,
          delivery_method: deliveryMethod,
          shipping_address: shippingAddress,
          amount: listing.price,
        });

      if (error) throw error;

      toast({
        title: "Order created!",
        description: "The seller will be notified of your order.",
      });

      setShowOrderDialog(false);
      navigate("/orders");
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
    }
  };

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
              <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
                <DialogTrigger asChild>
                  <Button>Buy Now</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Complete Your Order</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Payment Method</Label>
                      <Select value={paymentMethod} onValueChange={(value: typeof paymentMethod) => setPaymentMethod(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {listing.payment_methods.map((method) => (
                            <SelectItem key={method} value={method}>
                              {method.replace(/_/g, ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Delivery Method</Label>
                      <Select value={deliveryMethod} onValueChange={(value: typeof deliveryMethod) => setDeliveryMethod(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {listing.delivery_method === "both" ? (
                            <>
                              <SelectItem value="shipping">Shipping</SelectItem>
                              <SelectItem value="pickup">Pickup</SelectItem>
                            </>
                          ) : (
                            <SelectItem value={listing.delivery_method}>
                              {listing.delivery_method}
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {deliveryMethod === "shipping" && (
                      <div className="space-y-2">
                        <Label>Shipping Address</Label>
                        <Input
                          value={shippingAddress}
                          onChange={(e) => setShippingAddress(e.target.value)}
                          placeholder="Enter your shipping address"
                          required
                        />
                      </div>
                    )}

                    <Button onClick={handleCreateOrder} className="w-full">
                      Confirm Order
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
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
            <div className="space-y-4">
              <Badge variant="secondary">{listing.condition}</Badge>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{listing.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(listing.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>{listing.seller?.username}</span>
                </div>
              </div>
              <div className="prose max-w-none">
                <h3>Description</h3>
                <p>{listing.description}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};