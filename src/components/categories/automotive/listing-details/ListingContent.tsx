import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ListingHeader } from "./ListingHeader";
import { ListingDetails } from "./ListingDetails";
import { ContactButton } from "./ContactButton";
import { ListingMedia } from "./ListingMedia";
import { ListingReviews } from "./ListingReviews";
import { ListingComments } from "./ListingComments";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";

interface ListingContentProps {
  listing: {
    id: string;
    title: string;
    price: number;
    seller_id: string;
    condition: string;
    location: string;
    created_at: string;
    make?: string;
    model?: string;
    year?: number;
    mileage?: number;
    section: string;
    description: string;
    images?: string[];
    is_business: boolean;
    profiles?: {
      username?: string;
      avatar_url?: string;
    };
  };
  comments?: any[];
}

export const ListingContent = ({ listing, comments }: ListingContentProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleContact = () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to contact sellers",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Coming soon",
      description: "Contact functionality will be available soon",
    });
  };

  const handleCommentAdded = () => {
    queryClient.invalidateQueries({ queryKey: ["listing_comments", listing.id] });
  };

  const handleReviewSubmitted = () => {
    queryClient.invalidateQueries({ queryKey: ["listing_reviews", listing.id] });
  };

  return (
    <Card>
      <CardHeader>
        <ListingHeader
          title={listing.title}
          price={listing.price}
          seller={listing.profiles}
          created_at={listing.created_at}
        />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ListingMedia 
            image={listing.images?.[0]} 
            title={listing.title} 
          />
          <div className="space-y-4">
            <ListingDetails
              condition={listing.condition}
              location={listing.location}
              created_at={listing.created_at}
              make={listing.make}
              model={listing.model}
              year={listing.year}
              mileage={listing.mileage}
              section={listing.section}
              description={listing.description}
            />
            <ContactButton
              isOwner={user?.id === listing.seller_id}
              isBusiness={listing.is_business}
              onContact={handleContact}
            />
          </div>
        </div>
        
        <Separator />
        
        <ListingReviews
          listingId={listing.id}
          sellerId={listing.seller_id}
          onReviewSubmitted={handleReviewSubmitted}
        />

        <Separator />
        
        <ListingComments 
          comments={comments}
          listingId={listing.id}
          onCommentAdded={handleCommentAdded}
        />
      </CardContent>
    </Card>
  );
};