
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CartItem } from './CartItem';
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart as CartIcon } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

export const ShoppingCart = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cartItems, isLoading } = useQuery({
    queryKey: ['cart-items', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('beauty_marketplace_cart_items')
        .select(`
          *,
          beauty_marketplace_listings!inner (
            title,
            price,
            images
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      if (quantity === 0) {
        const { error } = await supabase
          .from('beauty_marketplace_cart_items')
          .delete()
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('beauty_marketplace_cart_items')
          .update({ quantity })
          .eq('id', id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart-items'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update cart",
        variant: "destructive",
      });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('beauty_marketplace_cart_items')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart-items'] });
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    },
  });

  const handleUpdateQuantity = (id: string, quantity: number) => {
    updateQuantityMutation.mutate({ id, quantity });
  };

  const handleRemoveItem = (id: string) => {
    removeItemMutation.mutate(id);
  };

  const handleCheckout = () => {
    // TODO: Implement checkout flow
    toast({
      title: "Coming soon!",
      description: "Checkout functionality will be available soon.",
    });
  };

  if (isLoading) {
    return <div>Loading cart...</div>;
  }

  const totalAmount = cartItems?.reduce((total, item) => {
    return total + (item.beauty_marketplace_listings.price * item.quantity);
  }, 0) || 0;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CartIcon className="h-5 w-5" />
          Shopping Cart
        </CardTitle>
      </CardHeader>
      <CardContent className="divide-y">
        {!cartItems?.length ? (
          <div className="text-center py-8 text-muted-foreground">
            Your cart is empty
          </div>
        ) : (
          cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={{
                id: item.id,
                title: item.beauty_marketplace_listings.title,
                price: item.beauty_marketplace_listings.price,
                quantity: item.quantity,
                image: item.beauty_marketplace_listings.images[0],
              }}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemoveItem}
            />
          ))
        )}
      </CardContent>
      {cartItems?.length > 0 && (
        <CardFooter className="flex justify-between items-center">
          <div className="text-lg font-semibold">
            Total: {formatCurrency(totalAmount)}
          </div>
          <Button onClick={handleCheckout}>
            Proceed to Checkout
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
