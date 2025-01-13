import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TechnologyHeader } from "@/components/categories/technology/TechnologyHeader";
import { TechnologySidebar } from "@/components/categories/technology/TechnologySidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "@/components/PostCard";
import { Laptop, Code, Cpu, Rocket } from "lucide-react";
import { Post } from "@/types/post";

const Technology = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("latest");

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
    queryKey: ["posts", "technology", selectedTab, searchQuery],
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
          categories (name),
          likes (count),
          comments (count)
        `)
        .eq("category_id", parentCategory.id);

      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      if (selectedTab !== "latest") {
        const subcategory = subcategories?.find(
          (sub) => sub.name.toLowerCase().replace(/\s+/g, "-") === selectedTab
        );
        if (subcategory) {
          query = query.eq("subcategory_id", subcategory.id);
        }
      }

      const { data, error } = await query;
      if (error) throw error;

      return data.map(post => ({
        ...post,
        _count: {
          likes: post.likes?.length || 0,
          comments: post.comments?.length || 0
        }
      })) as Post[];
    },
  });

  return (
    <div className="container mx-auto py-8">
      <TechnologyHeader
        onSearch={setSearchQuery}
        onCreatePost={() => navigate("/create-post")}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="w-full justify-start mb-6">
              <TabsTrigger value="latest">
                <Laptop className="w-4 h-4 mr-2" />
                Latest
              </TabsTrigger>
              <TabsTrigger value="product-reviews">
                <Code className="w-4 h-4 mr-2" />
                Product Reviews
              </TabsTrigger>
              <TabsTrigger value="tech-jobs">
                <Cpu className="w-4 h-4 mr-2" />
                Tech Jobs
              </TabsTrigger>
              <TabsTrigger value="tech-marketplace">
                <Rocket className="w-4 h-4 mr-2" />
                Marketplace
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="space-y-6">
              {posts?.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </TabsContent>
          </Tabs>
        </div>

        <TechnologySidebar subcategories={subcategories} />
      </div>
    </div>
  );
};

export default Technology;