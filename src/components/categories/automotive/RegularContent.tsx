import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PostsList } from "./PostsList";
import { SubcategoryHeader } from "./SubcategoryHeader";
import { getSubcategoryDescription } from "./utils";
import WorkshopSearch from "@/components/workshops/WorkshopSearch";
import { Post } from "@/types/post";

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface RegularContentProps {
  subcategories?: Category[];
  selectedSubcategory: string | null;
  searchQuery: string;
}

export const RegularContent = ({ 
  subcategories,
  selectedSubcategory,
  searchQuery 
}: RegularContentProps) => {
  const { data: postsData } = useQuery({
    queryKey: ["posts", "automotive", searchQuery, selectedSubcategory],
    queryFn: async () => {
      let query = supabase
        .from("posts")
        .select(`
          *,
          profiles (username, avatar_url),
          categories!posts_category_id_fkey (name),
          likes (count),
          comments (count)
        `);

      if (selectedSubcategory) {
        query = query.eq('subcategory_id', selectedSubcategory);
      }

      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Transform the data to match the Post type
      return data?.map(post => ({
        ...post,
        _count: {
          likes: post.likes?.[0]?.count || 0,
          comments: post.comments?.[0]?.count || 0
        }
      })) as Post[];
    },
  });

  const selectedSubcategoryData = subcategories?.find(s => s.id === selectedSubcategory);

  if (selectedSubcategoryData?.name === "Workshops & Services") {
    return <WorkshopSearch />;
  }

  return (
    <>
      {selectedSubcategory && (
        <SubcategoryHeader
          name={selectedSubcategoryData?.name || ""}
          description={getSubcategoryDescription(selectedSubcategoryData?.name || "")}
        />
      )}
      <PostsList posts={postsData} searchQuery={searchQuery} />
    </>
  );
};