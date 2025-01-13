import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";

interface Post {
  id: string;
  title: string;
  content: string;
  image_url?: string | null;
  created_at: string;
  user_id: string;
  category_id: string | null;
  profiles: {
    username: string;
    avatar_url?: string | null;
  };
  categories: {
    name: string;
  } | null;
}

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: posts } = useQuery({
    queryKey: ["posts", selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from("posts")
        .select(`
          *,
          profiles (username, avatar_url),
          categories (name)
        `)
        .order("created_at", { ascending: false });

      if (selectedCategory !== "all") {
        query = query.eq("category_id", selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return data as Post[];
    },
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background font-poppins">
      <Navigation />
      <main className="container py-8">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full overflow-x-auto flex space-x-2 mb-6">
            <TabsTrigger value="all" onClick={() => setSelectedCategory("all")}>
              All Posts
            </TabsTrigger>
            {categories?.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts?.map((post) => (
                <Card
                  key={post.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/post/${post.id}`)}
                >
                  {post.image_url && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar>
                        <AvatarImage src={post.profiles?.avatar_url ?? undefined} />
                        <AvatarFallback>
                          {post.profiles?.username?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{post.profiles?.username}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(post.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3">
                      {post.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;