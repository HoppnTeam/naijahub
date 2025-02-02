import { Button } from "@/components/ui/button";
import { MessageSquare, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { ChatDialog } from "./ChatDialog";
import { useAuth } from "@/contexts/AuthContext";

interface SellerActionsProps {
  seller?: {
    username?: string;
    user_id?: string;
  };
  title: string;
  listingId: string;
}

export const SellerActions = ({ seller, title, listingId }: SellerActionsProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleBuyNow = () => {
    toast({
      title: "Coming Soon!",
      description: "Payment integration will be available soon.",
      variant: "default"
    });
  };

  const handleOpenChat = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to chat with the seller",
        variant: "destructive"
      });
      return;
    }

    if (user.id === seller?.user_id) {
      toast({
        title: "Cannot message yourself",
        description: "This is your own listing",
        variant: "destructive"
      });
      return;
    }

    setIsChatOpen(true);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold">Seller Information</h4>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {seller?.username}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleBuyNow}
            className="w-full sm:w-auto"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Buy Now
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleOpenChat}
            className="w-full sm:w-auto"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Chat with Seller
          </Button>
        </div>
      </div>

      <ChatDialog
        open={isChatOpen}
        onOpenChange={setIsChatOpen}
        listing={{
          id: listingId,
          title,
          seller
        }}
      />
    </div>
  );
};