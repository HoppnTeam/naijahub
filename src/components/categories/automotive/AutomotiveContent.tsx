import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Car } from "lucide-react";
import { WorkshopSearch } from "@/components/workshops/WorkshopSearch";
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
        .from("posts")
        .select(`
          *,
          profiles!posts_user_id_profiles_fkey (username, avatar_url),
          categories!posts_category_id_fkey (name),
          likes (id),
          comments (id)
        `)
        .eq("categories.name", "Automotive");

      if (selectedSubcategory) {
        query = query.eq("subcategory_id", selectedSubcategory);
      }

      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data.map(post => ({
        ...post,
        _count: {
          likes: post.likes?.length || 0,
          comments: post.comments?.length || 0
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
          description="View all posts"
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
      </div>

      {/* Selected Subcategory Header */}
      {selectedSubcategory && subcategories?.find(s => s.id === selectedSubcategory) && (
        <SubcategoryHeader
          name={subcategories.find(s => s.id === selectedSubcategory)?.name || ""}
          description={getSubcategoryDescription(subcategories.find(s => s.id === selectedSubcategory)?.name || "")}
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