import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, TrendingUp, MessageSquare, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PostCard } from "@/components/PostCard";
import { useAuth } from "@/contexts/AuthContext";

interface Post {
  id: string;
  title: string;
  content: string;
  image_url?: string | null;
  created_at: string;
  pinned: boolean;
  is_live: boolean;
  user_id: string;
  profiles: {
    username: string;
    avatar_url?: string | null;
  } | null;
  _count?: {
    comments: number;
    likes: number;
  };
}

const NewsAndPolitics = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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

      if (selectedTab === "trending") {
        query = query.order("likes.count", { ascending: false });
      } else if (selectedTab === "pinned") {
        query = query.eq("pinned", true);
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;

      return data.map(post => ({
        ...post,
        _count: {
          likes: post.likes?.length || 0,
          comments: post.comments?.length || 0
        }
      }));
    },
  });

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">News & Politics</h1>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search news and discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => navigate("/create-post")}>Create Post</Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Content Feed */}
        <div className="lg:col-span-3">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="w-full justify-start mb-6">
              <TabsTrigger value="latest">Latest</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="pinned">Pinned</TabsTrigger>
              <TabsTrigger value="live">Live Discussions</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="space-y-6">
              {posts?.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Subcategories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {subcategories?.map((subcategory) => (
                <Button
                  key={subcategory.id}
                  variant="ghost"
                  className="w-full justify-start"
                >
                  {subcategory.name}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Top Contributors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Contributors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span>Most Active Users</span>
                </div>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Related Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Related Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  Technology
                </Button>
                <Button variant="outline" size="sm">
                  Business
                </Button>
                <Button variant="outline" size="sm">
                  International
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
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