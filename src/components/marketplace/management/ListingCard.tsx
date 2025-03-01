import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { PostActions } from "@/components/PostActions";
import { ListingActions } from "./ListingActions";

interface ListingCardProps {
  listing: any;
  marketplace: "tech" | "auto" | "beauty";
  onEdit: (listing: any) => void;
  onDelete: (id: string, marketplace: "tech" | "auto" | "beauty") => void;
  onChatOpen: (listingId: string) => void;
  unreadMessages: number;
  likesCount: number;
}

export const ListingCard = ({
  listing,
  marketplace,
  onEdit,
  onDelete,
  onChatOpen,
  unreadMessages,
  likesCount,
}: ListingCardProps) => {
  return (
    <Card key={listing.id}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{listing.title}</h3>
            <div className="text-sm text-muted-foreground">
              {marketplace === "tech" 
                ? "Tech" 
                : marketplace === "auto" 
                  ? "Auto" 
                  : "Beauty"} Marketplace
            </div>
          </div>
          <Badge>{listing.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-square w-24 rounded-lg overflow-hidden">
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Price</div>
            <div className="font-semibold">{formatCurrency(listing.price)}</div>
          </div>
        </div>

        <PostActions
          postId={listing.id}
          initialLikesCount={likesCount}
          commentsCount={unreadMessages}
        />

        <ListingActions
          listing={listing}
          marketplace={marketplace}
          onEdit={onEdit}
          onDelete={onDelete}
          onChatOpen={onChatOpen}
          unreadMessages={unreadMessages}
        />
      </CardContent>
    </Card>
  );
};