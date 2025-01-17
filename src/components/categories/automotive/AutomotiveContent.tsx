import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Car } from "lucide-react";
import WorkshopSearch from "@/components/workshops/WorkshopSearch";
import { SubcategoryButton } from "./SubcategoryButton";
import { SubcategoryHeader } from "./SubcategoryHeader";
import { PostsList } from "./PostsList";
import { getSubcategoryIcon, getSubcategoryDescription } from "./utils";

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
        .from("auto_marketplace_listings")
        .select(`
          *,
          profiles!auto_marketplace_listings_seller_id_fkey (username, avatar_url)
        `);

      if (selectedSubcategory) {
        query = query.eq('vehicle_type', selectedSubcategory);
      }

      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data.map(listing => ({
        ...listing,
        id: listing.id,
        title: listing.title,
        content: listing.description,
        image_url: listing.images[0],
        created_at: listing.created_at,
        profiles: listing.profiles,
        _count: {
          likes: 0,
          comments: 0
        }
      }));
    },
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
        
        {/* Vehicle subcategories */}
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
      </div>

      {/* Selected Subcategory Header */}
      {selectedSubcategory && (
        <SubcategoryHeader
          name={subcategories?.find(s => s.id === selectedSubcategory)?.name || ""}
          description={getSubcategoryDescription(subcategories?.find(s => s.id === selectedSubcategory)?.name || "")}
        />
      )}

      {/* Content Area */}
      {selectedSubcategory && 
       subcategories?.find(s => s.id === selectedSubcategory)?.name === "Workshops & Services" ? (
        <WorkshopSearch />
      ) : (
        <PostsList posts={postsData} searchQuery={searchQuery} />
      )}
    </div>
  );
};