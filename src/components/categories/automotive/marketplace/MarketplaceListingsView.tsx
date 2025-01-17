import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostsList } from "../PostsList";
import type { SearchFilters as SearchFiltersType } from "../SearchFilters";

interface MarketplaceListingsViewProps {
  listingsData: any[] | undefined;
  searchQuery: string;
}

export const MarketplaceListingsView = ({
  listingsData,
  searchQuery,
}: MarketplaceListingsViewProps) => {
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