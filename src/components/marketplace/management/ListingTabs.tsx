import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListingCard } from "./ListingCard";

interface ListingTabsProps {
  techListings: any[];
  autoListings: any[];
  onEdit: (listing: any) => void;
  onDelete: (id: string, marketplace: "tech" | "auto") => void;
  onChatOpen: (listingId: string) => void;
}

export const ListingTabs = ({
  techListings,
  autoListings,
  onEdit,
  onDelete,
  onChatOpen,
}: ListingTabsProps) => {
  return (
    <Tabs defaultValue="tech" className="w-full">
      <TabsList>
        <TabsTrigger value="tech">Tech Listings</TabsTrigger>
        <TabsTrigger value="auto">Auto Listings</TabsTrigger>
      </TabsList>

      <TabsContent value="tech" className="space-y-4">
        {!techListings?.length ? (
          <div className="text-center py-8 text-muted-foreground">
            No tech listings found
          </div>
        ) : (
          techListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              marketplace="tech"
              onEdit={onEdit}
              onDelete={onDelete}
              onChatOpen={onChatOpen}
              unreadMessages={listing.marketplace_chats?.reduce((acc: number, chat: any) => {
                const unreadCount = chat.marketplace_messages?.filter(
                  (msg: any) => !msg.read_at
                ).length;
                return acc + (unreadCount || 0);
              }, 0)}
              likesCount={listing.tech_marketplace_likes?.[0]?.count || 0}
            />
          ))
        )}
      </TabsContent>

      <TabsContent value="auto" className="space-y-4">
        {!autoListings?.length ? (
          <div className="text-center py-8 text-muted-foreground">
            No auto listings found
          </div>
        ) : (
          autoListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              marketplace="auto"
              onEdit={onEdit}
              onDelete={onDelete}
              onChatOpen={onChatOpen}
              unreadMessages={listing.marketplace_chats?.reduce((acc: number, chat: any) => {
                const unreadCount = chat.marketplace_messages?.filter(
                  (msg: any) => !msg.read_at
                ).length;
                return acc + (unreadCount || 0);
              }, 0)}
              likesCount={listing.auto_marketplace_likes?.[0]?.count || 0}
            />
          ))
        )}
      </TabsContent>
    </Tabs>
  );
};