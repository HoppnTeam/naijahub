import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Car, Wrench } from "lucide-react";
import WorkshopSearch from "@/components/workshops/WorkshopSearch";
import { SubcategoryButton } from "./SubcategoryButton";
import { SubcategoryHeader } from "./SubcategoryHeader";
import { PostsList } from "./PostsList";
import { getSubcategoryIcon, getSubcategoryDescription } from "./utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface AutomotiveContentProps {
  subcategories?: Category[];
  selectedSubcategory: string | null;
  onSubcategoryChange: (subcategoryId: string | null) => void;
  searchQuery: string;
}

export const AutomotiveContent = ({ 
  subcategories,
  selectedSubcategory,
  onSubcategoryChange,
  searchQuery 
}: AutomotiveContentProps) => {
  const { data: postsData } = useQuery({
    queryKey: ["posts", "automotive", searchQuery, selectedSubcategory],
    queryFn: async () => {
      let query = supabase
        .from("posts")
        .select(`
          *,
          profiles!posts_user_id_profiles_fkey (username, avatar_url),
          _count {
            likes,
            comments
          }
        `);

      if (selectedSubcategory) {
        query = query.eq('subcategory_id', selectedSubcategory);
      }

      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !selectedSubcategory || selectedSubcategory !== "marketplace"
  });

  const { data: listingsData } = useQuery({
    queryKey: ["auto_marketplace", searchQuery, selectedSubcategory],
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
    enabled: selectedSubcategory === "marketplace"
  });

  return (
    <div className="space-y-6">
      {/* Subcategories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SubcategoryButton
          id={null}
          name="All Automotive"
          description="View all listings"
          icon={<Car className="h-5 w-5 flex-shrink-0" />}
          isSelected={selectedSubcategory === null}
          onClick={() => onSubcategoryChange(null)}
        />
        
        {subcategories?.map((subcategory) => (
          <SubcategoryButton
            key={subcategory.id}
            id={subcategory.id}
            name={subcategory.name}
            description={getSubcategoryDescription(subcategory.name)}
            icon={getSubcategoryIcon(subcategory.name)}
            isSelected={selectedSubcategory === subcategory.id}
            onClick={() => onSubcategoryChange(subcategory.id)}
          />
        ))}

        <SubcategoryButton
          id="marketplace"
          name="Auto Marketplace"
          description="Buy and sell vehicles and parts"
          icon={<Car className="h-5 w-5 flex-shrink-0" />}
          isSelected={selectedSubcategory === "marketplace"}
          onClick={() => onSubcategoryChange("marketplace")}
        />
      </div>

      {/* Selected Subcategory Header */}
      {selectedSubcategory && selectedSubcategory !== "marketplace" && (
        <SubcategoryHeader
          name={subcategories?.find(s => s.id === selectedSubcategory)?.name || ""}
          description={getSubcategoryDescription(subcategories?.find(s => s.id === selectedSubcategory)?.name || "")}
        />
      )}

      {/* Content Area */}
      {selectedSubcategory === "marketplace" ? (
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
      ) : selectedSubcategory && 
         subcategories?.find(s => s.id === selectedSubcategory)?.name === "Workshops & Services" ? (
        <WorkshopSearch />
      ) : (
        <PostsList posts={postsData} searchQuery={searchQuery} />
      )}
    </div>
  );
};