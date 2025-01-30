import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PostsList } from "./PostsList";
import { SubcategoryHeader } from "./SubcategoryHeader";
import { getSubcategoryDescription } from "./utils";
import { Card, CardContent } from "@/components/ui/card";
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
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <h3 className="text-2xl font-semibold mb-2">Coming Soon!</h3>
          <p className="text-muted-foreground text-center max-w-md">
            We're working on bringing you a comprehensive directory of automotive workshops and services. 
            Stay tuned for this exciting feature!
          </p>
        </CardContent>
      </Card>
    );
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