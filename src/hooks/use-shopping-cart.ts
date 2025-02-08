
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useShoppingCart = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addToCart = useMutation({
    mutationFn: async ({ listingId, quantity = 1 }: { listingId: string; quantity?: number }) => {
      if (!user) throw new Error('User must be logged in');

      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from('beauty_marketplace_cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('listing_id', listingId)
        .single();

      if (existingItem) {
        // Update quantity if item exists
        const { error } = await supabase
          .from('beauty_marketplace_cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);
        if (error) throw error;
      } else {
        // Insert new item if it doesn't exist
        const { error } = await supabase
          .from('beauty_marketplace_cart_items')
          .insert({
            user_id: user.id,
            listing_id: listingId,
            quantity
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart-items'] });
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    },
  });

  const { data: cartItemsCount } = useQuery({
    queryKey: ['cart-items-count', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { count, error } = await supabase
        .from('beauty_marketplace_cart_items')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!user,
  });

  return {
    addToCart,
    cartItemsCount,
  };
};
