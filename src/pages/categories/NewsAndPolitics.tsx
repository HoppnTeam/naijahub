import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "@/components/PostCard";
import { NewsHeader } from "@/components/categories/news-politics/NewsHeader";
import { NewsSidebar } from "@/components/categories/news-politics/NewsSidebar";
import { Post } from "@/types/post";
import { BackNavigation } from "@/components/BackNavigation";
import { Badge } from "@/components/ui/badge";

const NewsAndPolitics = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("latest");

  const { data: subcategories } = useQuery({
    queryKey: ["subcategories", "news-politics"],
    queryFn: async () => {
      const { data: parentCategory } = await supabase
        .from("categories")
        .select("id")
        .eq("name", "News & Politics")
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
    queryKey: ["posts", "news-politics", selectedTab, searchQuery],
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
        .eq("category_id", (await supabase
          .from("categories")
          .select("id")
          .eq("name", "News & Politics")
          .single()).data?.id);

      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      switch (selectedTab) {
        case "trending":
          query = query.order("created_at", { ascending: false });
          break;
        case "pinned":
          query = query.eq("pinned", true);
          break;
        case "live":
          query = query.eq("is_live", true)
            .order("created_at", { ascending: false });
          break;
        default:
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

  return (
    <div className="container mx-auto py-8">
      <BackNavigation />
      <NewsHeader
        onSearch={setSearchQuery}
        onCreatePost={() => navigate("/create-post")}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="w-full justify-start mb-6">
              <TabsTrigger value="latest">Latest</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="pinned">Pinned</TabsTrigger>
              <TabsTrigger value="live" className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-red-500 animate-pulse" />
                Live Discussions
                <Badge variant="secondary" className="ml-1">New</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="space-y-6">
              {posts?.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {selectedTab === "live" 
                      ? "No live discussions at the moment. Start one!" 
                      : "No posts found."}
                  </p>
                  <Button 
                    onClick={() => navigate("/create-post")} 
                    className="mt-4"
                  >
                    Create Post
                  </Button>
                </div>
              ) : (
                posts?.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>

        <NewsSidebar subcategories={subcategories} />
      </div>

      <div className="mt-8 border-t pt-6">
        <div className="flex justify-between items-center">
          <div className="space-x-4">
            <Button variant="link">Report Issue</Button>
            <Button variant="link">Help Center</Button>
            <Button variant="link">Community Guidelines</Button>
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

export default NewsAndPolitics;