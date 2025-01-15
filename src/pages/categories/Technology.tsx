import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Laptop, Code, Cpu, Rocket, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "@/components/PostCard";
import { TechnologyHeader } from "@/components/categories/technology/TechnologyHeader";
import { TechnologySidebar } from "@/components/categories/technology/TechnologySidebar";
import { Post } from "@/types/post";
import { BackNavigation } from "@/components/BackNavigation";
import { MarketplaceListings } from "@/components/marketplace/MarketplaceListings";
import { TechJobsList } from "@/components/jobs/TechJobsList";

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
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="w-full justify-start mb-6">
              <TabsTrigger value="latest">
                <Laptop className="w-4 h-4 mr-2" />
                Latest
              </TabsTrigger>
              <TabsTrigger value="trending">
                <Code className="w-4 h-4 mr-2" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="tech-jobs">
                <Cpu className="w-4 h-4 mr-2" />
                Tech Jobs
              </TabsTrigger>
              <TabsTrigger value="tech-marketplace">
                <Package className="w-4 h-4 mr-2" />
                Marketplace
              </TabsTrigger>
            </TabsList>

            <TabsContent value="latest" className="space-y-6">
              {posts?.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
              {posts?.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No posts found
                </div>
              )}
            </TabsContent>

            <TabsContent value="trending" className="space-y-6">
              {posts?.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
              {posts?.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No trending posts
                </div>
              )}
            </TabsContent>

            <TabsContent value="tech-jobs">
              <TechJobsList />
            </TabsContent>

            <TabsContent value="tech-marketplace">
              <MarketplaceListings />
            </TabsContent>
          </Tabs>
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
