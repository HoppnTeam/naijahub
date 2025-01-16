import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Medal, Users, Dumbbell, Gamepad2, Activity, Target, Swords } from "lucide-react";
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
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  // Fetch sports subcategories
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

  // Fetch posts based on selected subcategory
  const { data: posts } = useQuery<Post[]>({
    queryKey: ["posts", "sports", selectedTab, searchQuery, selectedSubcategory],
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

  const getSubcategoryIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'football':
        return <Trophy className="w-4 h-4 mr-2" />;
      case 'basketball':
        return <Target className="w-4 h-4 mr-2" />;
      case 'athletics':
        return <Activity className="w-4 h-4 mr-2" />;
      case 'cricket':
        return <Gamepad2 className="w-4 h-4 mr-2" />;
      case 'tennis':
        return <Swords className="w-4 h-4 mr-2" />;
      case 'combat sports':
        return <Dumbbell className="w-4 h-4 mr-2" />;
      default:
        return <Trophy className="w-4 h-4 mr-2" />;
    }
  };

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
              <TabsTrigger value="trending">
                <Medal className="w-4 h-4 mr-2" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="fan-zone">
                <Users className="w-4 h-4 mr-2" />
                Fan Zone
              </TabsTrigger>
            </TabsList>

            <div className="mb-6 flex flex-wrap gap-2">
              <Button
                variant={selectedSubcategory === null ? "default" : "outline"}
                onClick={() => setSelectedSubcategory(null)}
              >
                All Sports
              </Button>
              {subcategories?.map((subcategory) => (
                <Button
                  key={subcategory.id}
                  variant={selectedSubcategory === subcategory.id ? "default" : "outline"}
                  onClick={() => setSelectedSubcategory(subcategory.id)}
                  className="flex items-center"
                >
                  {getSubcategoryIcon(subcategory.name)}
                  {subcategory.name}
                </Button>
              ))}
            </div>

            <TabsContent value={selectedTab} className="space-y-6">
              {posts?.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
              {posts?.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No posts found. Be the first to create a post in this category!
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <SportsSidebar subcategories={subcategories} />
      </div>
    </div>
  );
};

export default Sports;