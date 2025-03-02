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
            total_amount: totalAmount,
            status: 'pending',
            shipping_address: `${formData.address}, ${formData.city}, ${formData.state}`,
            payment_method: formData.paymentMethod,
            contact_info: {
              name: formData.fullName,
              email: formData.email,
              phone: formData.phone
            },
            payment_details: formData.paymentMethod === 'card' ? {
              card_number: formData.cardNumber ? `xxxx-xxxx-xxxx-${formData.cardNumber.slice(-4)}` : null,
            } : null,
            delivery_notes: formData.deliveryNotes || null,
          })
          .select()
          .single();

        if (orderError) throw orderError;

        // 2. Create order items
        const orderItems = cartItems.map(item => ({
          order_id: order.id,
          listing_id: item.listing_id,
          quantity: item.quantity,
          price: item.beauty_marketplace_listings.price,
        }));

        const { error: itemsError } = await supabase
          .from('beauty_marketplace_order_items')
          .insert(orderItems)
          .select();

        if (itemsError) throw itemsError;

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
