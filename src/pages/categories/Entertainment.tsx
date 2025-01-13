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

const Entertainment = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("latest");

  const { data: subcategories } = useQuery({
    queryKey: ["subcategories", "entertainment"],
    queryFn: async () => {
      const { data: parentCategory } = await supabase
        .from("categories")
        .select("id")
        .eq("name", "Entertainment")
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
    queryKey: ["posts", "entertainment", selectedTab, searchQuery],
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
          .eq("name", "Entertainment")
          .single()).data?.id);

      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      switch (selectedTab) {
        case "trending":
          query = query.order("created_at", { ascending: false });
          break;
        case "media":
          query = query.not("image_url", "is", null)
            .order("created_at", { ascending: false });
          break;
        case "celebrities":
          query = query.order("created_at", { ascending: false });
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
      <EntertainmentHeader
        onSearch={setSearchQuery}
        onCreatePost={() => navigate("/create-post")}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="w-full justify-start mb-6">
              <TabsTrigger value="latest">Latest</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="media">Media Gallery</TabsTrigger>
              <TabsTrigger value="celebrities">Celebrity Corner</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="space-y-6">
              {posts?.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </TabsContent>
          </Tabs>
        </div>

        <EntertainmentSidebar subcategories={subcategories} />
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
