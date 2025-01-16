import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SportsHeader } from "@/components/categories/sports/SportsHeader";
import { SportsSidebar } from "@/components/categories/sports/SportsSidebar";
import { SportsContent } from "@/components/categories/sports/SportsContent";
import { BackNavigation } from "@/components/BackNavigation";
import { Post } from "@/types/post";

const Sports = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  const { data: subcategories } = useQuery({
    queryKey: ["subcategories", "sports"],
    queryFn: async () => {
      const { data: parentCategory } = await supabase
        .from("categories")
        .select("id")
        .eq("name", "Sports")
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

  const { data: posts } = useQuery<Post[]>({
    queryKey: ["posts", "sports", searchQuery, selectedSubcategory],
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
        .eq("categories.name", "Sports");

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
      })) as Post[];
    },
  });

  const handleCreatePost = () => {
    navigate("/create-post", {
      state: {
        category: "Sports",
        categoryId: posts?.[0]?.category_id // Using the category_id from the first post
      }
    });
  };

  return (
    <div className="container mx-auto py-8">
      <BackNavigation />
      <SportsHeader
        onSearch={setSearchQuery}
        onCreatePost={handleCreatePost}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <SportsContent 
          posts={posts}
          subcategories={subcategories}
          selectedSubcategory={selectedSubcategory}
          onSubcategoryChange={setSelectedSubcategory}
        />
        <SportsSidebar subcategories={subcategories} />
      </div>
    </div>
  );
};

export default Sports;