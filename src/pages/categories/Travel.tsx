import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plane, MapPin, Globe, Camera, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "@/components/PostCard";
import { TravelHeader } from "@/components/categories/travel/TravelHeader";
import { TravelSidebar } from "@/components/categories/travel/TravelSidebar";
import { Post } from "@/types/post";

const Travel = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("latest");

  const { data: subcategories } = useQuery({
    queryKey: ["subcategories", "travel"],
    queryFn: async () => {
      const { data: parentCategory } = await supabase
        .from("categories")
        .select("id")
        .eq("name", "Travel")
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
    queryKey: ["posts", "travel", selectedTab, searchQuery],
    queryFn: async () => {
      const { data: parentCategory } = await supabase
        .from("categories")
        .select("id")
        .eq("name", "Travel")
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
    <div className="container mx-auto py-8">
      <TravelHeader
        onSearch={setSearchQuery}
        onCreatePost={() => navigate("/create-post")}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="w-full justify-start mb-6 overflow-x-auto">
              <TabsTrigger value="latest">
                <Plane className="w-4 h-4 mr-2" />
                Latest
              </TabsTrigger>
              <TabsTrigger value="destination-guides">
                <MapPin className="w-4 h-4 mr-2" />
                Destination Guides
              </TabsTrigger>
              <TabsTrigger value="travel-stories">
                <Camera className="w-4 h-4 mr-2" />
                Travel Stories
              </TabsTrigger>
              <TabsTrigger value="overseas-travel">
                <Globe className="w-4 h-4 mr-2" />
                Overseas Travel
              </TabsTrigger>
              <TabsTrigger value="street-foods">
                <UtensilsCrossed className="w-4 h-4 mr-2" />
                Street Foods
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="space-y-6">
              {posts?.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </TabsContent>
          </Tabs>
        </div>

        <TravelSidebar subcategories={subcategories} />
      </div>
    </div>
  );
};

export default Travel;