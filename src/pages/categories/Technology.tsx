import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TechnologyHeader } from "@/components/categories/technology/TechnologyHeader";
import { TechnologySidebar } from "@/components/categories/technology/TechnologySidebar";
import { BackNavigation } from "@/components/BackNavigation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Post } from "@/types/post";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "@/components/PostCard";
import { Laptop, Code, Cpu, Rocket } from "lucide-react";

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
          categories!posts_category_id_fkey (name),
          likes:likes(count),
          comments:comments(count)
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
          likes: Array.isArray(post.likes) ? post.likes[0]?.count || 0 : 0,
          comments: Array.isArray(post.comments) ? post.comments[0]?.count || 0 : 0
        }
      })) as Post[];
    },
  });

  return (
    <div className="container py-6">
      <BackNavigation />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-9">
          <TechnologyHeader onSearch={setSearchQuery} onCreatePost={() => navigate("/create-post")} />
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
        <div className="lg:col-span-3">
          <TechnologySidebar subcategories={subcategories} />
        </div>
      </div>
    </div>
  );
};

export default Technology;
