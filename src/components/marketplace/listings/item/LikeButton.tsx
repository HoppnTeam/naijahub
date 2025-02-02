import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface LikeButtonProps {
  listingId: string;
  isLiked?: boolean;
  onToggle?: () => void;
}

export const LikeButton = ({ 
  listingId,
  isLiked = false,
  onToggle 
}: LikeButtonProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLiking, setIsLiking] = useState(false);

  const { data: likeData, refetch: refetchLike } = useQuery({
    queryKey: ['listing-like', listingId, user?.id],
    queryFn: async () => {
      if (!user) return { isLiked: false, count: 0 };
      
      const { data: likeStatus } = await supabase
        .from('tech_marketplace_likes')
        .select('id')
        .eq('listing_id', listingId)
        .eq('user_id', user.id)
        .maybeSingle();

      const { count } = await supabase
        .from('tech_marketplace_likes')
        .select('id', { count: 'exact' })
        .eq('listing_id', listingId);

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
          .eq('listing_id', listingId)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('tech_marketplace_likes')
          .insert({
            listing_id: listingId,
            user_id: user.id
          });
      }
      await refetchLike();
      onToggle?.();
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

  return (
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
  );
};