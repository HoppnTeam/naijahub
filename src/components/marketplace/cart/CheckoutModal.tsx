import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckoutForm } from './CheckoutForm';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { handleAsyncError } from '@/lib/error-handling';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: any[];
  totalAmount: number;
  onCheckoutComplete: (orderId: string) => void;
}

export const CheckoutModal = ({
  isOpen,
  onClose,
  cartItems,
  totalAmount,
  onCheckoutComplete,
}: CheckoutModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const createOrderMutation = useMutation({
    mutationFn: async (formData: any) => {
      if (!user) throw new Error('User must be logged in');

      try {
        // 1. Create the order
        const { data: order, error: orderError } = await supabase
          .from('beauty_marketplace_orders')
          .insert({
            buyer_id: user.id,
            seller_id: cartItems[0]?.beauty_marketplace_listings?.seller_id || user.id, // Fallback to user.id if seller_id is not available
            listing_id: cartItems[0]?.listing_id, // Using the first item's listing_id
            amount: totalAmount,
            delivery_method: 'standard',
            payment_method: formData.paymentMethod,
            payment_status: 'pending',
            delivery_status: 'pending',
            shipping_address: `${formData.address}, ${formData.city}, ${formData.state}`,
          })
          .select()
          .single();

        if (orderError) throw orderError;

        // 3. Clear the cart
        const { error: clearCartError } = await supabase
          .from('beauty_marketplace_cart_items')
          .delete()
          .eq('user_id', user.id);

        if (clearCartError) throw clearCartError;

        return order;
      } catch (error) {
        handleAsyncError(error, "Failed to process order");
        throw error;
      }
    },
    onSuccess: (data) => {
      toast({
        title: "Order placed successfully!",
        description: "You will receive a confirmation email shortly.",
      });
      onCheckoutComplete(data.id);
    },
    onError: (error) => {
      handleAsyncError(error, "Checkout failed");
    },
  });

  const handleSubmit = (values: any) => {
    createOrderMutation.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>
            Complete your order by filling out the information below.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <CheckoutForm 
            onSubmit={handleSubmit} 
            isSubmitting={createOrderMutation.isPending} 
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
