import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostsList } from "./PostsList";
import { ListingDetailsView } from "./ListingDetailsView";
import { useParams } from "react-router-dom";

interface MarketplaceContentProps {
  searchQuery: string;
}

export const MarketplaceContent = ({ searchQuery }: MarketplaceContentProps) => {
  const { listingId } = useParams();

  // If we have a listingId, show the details view
  if (listingId) {
    return <ListingDetailsView />;
  }

  const { data: listingsData } = useQuery({
    queryKey: ["auto_marketplace", searchQuery],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("auto_marketplace_listings")
        .select(`
          *,
          profiles!auto_marketplace_listings_seller_id_profiles_fkey (username, avatar_url)
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <Tabs defaultValue="vehicles" className="w-full">
      <TabsList>
        <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
        <TabsTrigger value="parts">Parts</TabsTrigger>
      </TabsList>
      <TabsContent value="vehicles">
        <PostsList 
          listings={listingsData?.filter(l => l.section === 'vehicles')} 
          searchQuery={searchQuery}
          section="vehicles"
        />
      </TabsContent>
      <TabsContent value="parts">
        <PostsList 
          listings={listingsData?.filter(l => l.section === 'parts')} 
          searchQuery={searchQuery}
          section="parts"
        />
      </TabsContent>
    </Tabs>
  );
};