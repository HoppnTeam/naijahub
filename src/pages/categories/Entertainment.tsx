import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "@/components/PostCard";
import { EntertainmentHeader } from "@/components/categories/entertainment/EntertainmentHeader";
import { EntertainmentSidebar } from "@/components/categories/entertainment/EntertainmentSidebar";
import { Post } from "@/types/post";
import { BackNavigation } from "@/components/BackNavigation";
import { ScrollArea } from "@/components/ui/scroll-area";

const Entertainment = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("latest");

  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories", "entertainment"],
    queryFn: async () => {
      const { data: parentCategory, error: parentError } = await supabase
        .from("categories")
        .select("id")
        .eq("name", "Entertainment")
        .single();

      if (parentError) throw parentError;
      if (!parentCategory) return { mainCategory: null, subcategories: [] };

      const { data: subcategories, error: subError } = await supabase
        .from("categories")
        .select("*")
        .eq("parent_id", parentCategory.id);

      if (subError) throw subError;

      return {
        mainCategory: parentCategory,
        subcategories: subcategories || [],
      };
    },
  });

  const { data: posts, isLoading: isPostsLoading } = useQuery<Post[]>({
    queryKey: ["posts", "entertainment", selectedTab, searchQuery, categories?.mainCategory?.id],
    queryFn: async () => {
      if (!categories?.mainCategory?.id) {
        return [];
      }

      let query = supabase
        .from("posts")
        .select(`
          *,
          profiles (username, avatar_url),
          categories!posts_category_id_fkey (name),
          likes (count),
          comments (count)
        `)
        .eq("category_id", categories.mainCategory.id);

      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      if (selectedTab !== "latest" && selectedTab !== "trending") {
        query = query.eq("subcategory_id", selectedTab);
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
    enabled: !!categories?.mainCategory?.id,
  });

  const isLoading = isCategoriesLoading || isPostsLoading;

  // Group subcategories into rows
  const mainTabs = ["latest", "trending"];
  const subcategoryRows = categories?.subcategories?.reduce((acc: any[][], curr, i) => {
    const rowIndex = Math.floor(i / 4);
    if (!acc[rowIndex]) {
      acc[rowIndex] = [];
    }
    acc[rowIndex].push(curr);
    return acc;
  }, []) || [];

  return (
    <div className="container mx-auto py-8">
      <BackNavigation />
      <EntertainmentHeader
        onSearch={setSearchQuery}
        onCreatePost={() => navigate("/create-post")}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <ScrollArea className="w-full">
              <TabsList className="w-full justify-start mb-2 flex-wrap">
                {mainTabs.map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="capitalize"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {subcategoryRows.map((row, rowIndex) => (
                <TabsList key={rowIndex} className="w-full justify-start mb-2 flex-wrap">
                  {row.map((subcategory) => (
                    <TabsTrigger
                      key={subcategory.id}
                      value={subcategory.id}
                      className="text-sm"
                    >
                      {subcategory.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              ))}
            </ScrollArea>

            <TabsContent value={selectedTab} className="space-y-6">
              {isLoading ? (
                <div className="text-center py-8">Loading posts...</div>
              ) : posts && posts.length > 0 ? (
                posts.map((post) => <PostCard key={post.id} post={post} />)
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No posts found in this category
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <EntertainmentSidebar subcategories={categories?.subcategories} />
      </div>

      <div className="mt-8 border-t pt-6">
        <div className="flex justify-between items-center">
          <div className="space-x-4">
            <Button variant="link">Content Guidelines</Button>
            <Button variant="link">Submit Content</Button>
            <Button variant="link">Entertainment News</Button>
          </div>
          <Button variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" />
            Start Discussion
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Entertainment;