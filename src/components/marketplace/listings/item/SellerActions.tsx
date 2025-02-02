import { Button } from "@/components/ui/button";
import { ShoppingCart, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SellerActionsProps {
  seller?: {
    username?: string;
    email?: string;
  };
  title: string;
}

export const SellerActions = ({ seller, title }: SellerActionsProps) => {
  const { toast } = useToast();

  const handleBuyNow = () => {
    toast({
      title: "Coming Soon!",
      description: "Payment integration will be available soon.",
      variant: "default"
    });
  };

  const handleContactSeller = () => {
    if (!seller?.email) {
      toast({
        title: "Contact Information Unavailable",
        description: "The seller's contact information is not available.",
        variant: "destructive"
      });
      return;
    }

    window.location.href = `mailto:${seller.email}?subject=Inquiry about: ${title}`;
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
            <ShoppingCart className="mr-2" />
            Buy Now
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleContactSeller}
            className="w-full sm:w-auto"
          >
            <Info className="mr-2" />
            More Info
          </Button>
        </div>
      </div>
    </div>
  );
};