import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AutomotiveHeader } from "@/components/categories/automotive/AutomotiveHeader";
import { AutomotiveContent } from "@/components/categories/automotive/AutomotiveContent";
import { AutomotiveSidebar } from "@/components/categories/automotive/AutomotiveSidebar";
import { BackNavigation } from "@/components/BackNavigation";
import { Navigation } from "@/components/Navigation";

const Automotive = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  const { data: subcategories } = useQuery({
    queryKey: ["subcategories", "automotive"],
    queryFn: async () => {
      const { data: parentCategory } = await supabase
        .from("categories")
        .select("id")
        .eq("name", "Automotive")
        .single();

      if (!parentCategory) return [];

      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("parent_id", parentCategory.id);

      if (error) throw error;
      return data;
    },
  });

  const { data: posts } = useQuery({
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
          likes: Array.isArray(post.likes) ? post.likes[0]?.count || 0 : 0,
          comments: Array.isArray(post.comments) ? post.comments[0]?.count || 0 : 0
        }
      }));
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto py-8 px-4">
        <BackNavigation />
        <AutomotiveHeader onSearch={setSearchQuery} />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <AutomotiveContent 
              posts={posts}
              subcategories={subcategories}
              selectedSubcategory={selectedSubcategory}
              onSubcategoryChange={setSelectedSubcategory}
              searchQuery={searchQuery}
            />
          </div>
          <div className="lg:col-span-1">
            <AutomotiveSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Automotive;