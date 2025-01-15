import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TechnologyHeader } from "@/components/categories/technology/TechnologyHeader";
import { TechnologySidebar } from "@/components/categories/technology/TechnologySidebar";
import { TechnologyTabs } from "@/components/categories/technology/TechnologyTabs";
import { BackNavigation } from "@/components/BackNavigation";
import { Post } from "@/types/post";

const Technology = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("latest");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  const { data: subcategories } = useQuery({
    queryKey: ["subcategories", "technology"],
    queryFn: async () => {
      const { data: parentCategory } = await supabase
        .from("categories")
        .select("id")
        .eq("name", "Technology")
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
    queryKey: ["posts", "technology", selectedTab, searchQuery, selectedSubcategory],
    queryFn: async () => {
      const { data: parentCategory } = await supabase
        .from("categories")
        .select("id")
        .eq("name", "Technology")
        .single();

      if (!parentCategory) return [];

      let query = supabase
        .from("posts")
        .select(`
          *,
          profiles (username, avatar_url),
          categories!posts_category_id_fkey (name),
          likes:likes(count),
          comments:comments(count)
        `)
        .eq("category_id", parentCategory.id);

      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      if (selectedSubcategory) {
        query = query.eq("subcategory_id", selectedSubcategory);
      }

      if (selectedTab === "trending") {
        query = query.order("created_at", { ascending: false });
      } else {
        query = query.order("created_at", { ascending: false });
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
        category: "Technology",
        categoryId: subcategories?.[0]?.parent_id,
        subcategories
      }
    });
  };

  return (
    <div className="container mx-auto py-8">
      <BackNavigation />
      <TechnologyHeader
        onSearch={setSearchQuery}
        onCreatePost={handleCreatePost}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <TechnologyTabs 
            posts={posts}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
          />
        </div>

        <TechnologySidebar 
          subcategories={subcategories} 
          selectedSubcategoryId={selectedSubcategory}
          onSubcategorySelect={setSelectedSubcategory}
        />
      </div>
    </div>
  );
};

export default Technology;