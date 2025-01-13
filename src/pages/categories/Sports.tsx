import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Medal, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "@/components/PostCard";
import { SportsHeader } from "@/components/categories/sports/SportsHeader";
import { SportsSidebar } from "@/components/categories/sports/SportsSidebar";
import { LiveScoresWidget } from "@/components/categories/sports/LiveScoresWidget";
import { Post } from "@/types/post";
import { BackNavigation } from "@/components/BackNavigation";

const Sports = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("latest");

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
    queryKey: ["posts", "sports", selectedTab, searchQuery],
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
          .eq("name", "Sports")
          .single()).data?.id);

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

  return (
    <div className="container mx-auto py-8">
      <BackNavigation />
      <SportsHeader
        onSearch={setSearchQuery}
        onCreatePost={() => navigate("/create-post")}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <LiveScoresWidget />
          
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-8">
            <TabsList className="w-full justify-start mb-6">
              <TabsTrigger value="latest">
                <Trophy className="w-4 h-4 mr-2" />
                Latest
              </TabsTrigger>
              <TabsTrigger value="leagues">
                <Medal className="w-4 h-4 mr-2" />
                Leagues
              </TabsTrigger>
              <TabsTrigger value="fan-zone">
                <Users className="w-4 h-4 mr-2" />
                Fan Zone
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="space-y-6">
              {posts?.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </TabsContent>
          </Tabs>
        </div>

        <SportsSidebar subcategories={subcategories} />
      </div>
    </div>
  );
};

export default Sports;