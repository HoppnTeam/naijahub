import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Car, Wrench } from "lucide-react";
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

interface AutoPartsCategory {
  id: string;
  name: string;
  description: string;
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
        if (selectedSubcategory.startsWith('parts_')) {
          // For parts categories
          const partCategoryId = selectedSubcategory.replace('parts_', '');
          query = query
            .eq('section', 'parts')
            .eq('part_category_id', partCategoryId);
        } else {
          // For vehicle subcategories
          query = query
            .eq('section', 'vehicles')
            .eq('vehicle_type', selectedSubcategory);
        }
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

  const { data: autoPartsCategories } = useQuery({
    queryKey: ["auto-parts-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("auto_parts_categories")
        .select("*");
      
      if (error) throw error;
      return data;
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
            section="vehicles"
          />
        ))}

        {/* Auto Parts Categories */}
        {autoPartsCategories?.map((category) => (
          <SubcategoryButton
            key={`parts_${category.id}`}
            id={`parts_${category.id}`}
            name={category.name}
            description={category.description}
            icon={<Wrench className="h-5 w-5 flex-shrink-0" />}
            isSelected={selectedSubcategory === `parts_${category.id}`}
            onClick={() => onSubcategoryChange(`parts_${category.id}`)}
            section="parts"
          />
        ))}
      </div>

      {/* Selected Subcategory Header */}
      {selectedSubcategory && (
        <SubcategoryHeader
          name={
            selectedSubcategory.startsWith('parts_')
              ? autoPartsCategories?.find(c => `parts_${c.id}` === selectedSubcategory)?.name || ""
              : subcategories?.find(s => s.id === selectedSubcategory)?.name || ""
          }
          description={
            selectedSubcategory.startsWith('parts_')
              ? autoPartsCategories?.find(c => `parts_${c.id}` === selectedSubcategory)?.description || ""
              : getSubcategoryDescription(subcategories?.find(s => s.id === selectedSubcategory)?.name || "")
          }
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