import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: any;
  userId: string;
}

export const OrderDialog = ({ open, onOpenChange, listing, userId }: OrderDialogProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cash_on_delivery" | "in_person">("online");
  const [deliveryMethod, setDeliveryMethod] = useState<"shipping" | "pickup" | "both">("shipping");
  const [shippingAddress, setShippingAddress] = useState("");

  const handleCreateOrder = async () => {
    try {
      const { error } = await supabase
        .from("tech_marketplace_orders")
        .insert({
          listing_id: listing.id,
          buyer_id: userId,
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

      onOpenChange(false);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                {listing.payment_methods.map((method: string) => (
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
  );
};