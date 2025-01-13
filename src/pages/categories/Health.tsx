import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PostCard } from "@/components/PostCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Leaf, Brain, Apple, AlertCircle } from "lucide-react";
import { Post } from "@/types/post";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { BackNavigation } from "@/components/BackNavigation";

const Health = () => {
  const { toast } = useToast();
  const { data: posts } = useQuery({
    queryKey: ["health-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles:profiles!posts_user_id_profiles_fkey (username, avatar_url),
          categories:categories!posts_category_id_fkey (name),
          likes (count),
          comments (count)
        `)
        .eq("categories.name", "Health")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      return data?.map(post => ({
        ...post,
        _count: {
          likes: post.likes?.[0]?.count || 0,
          comments: post.comments?.[0]?.count || 0
        }
      })) as Post[];
    },
  });

  const handleAskProfessional = () => {
    toast({
      title: "Coming Soon",
      description: "The Ask a Professional feature will be available soon!",
    });
  };

  return (
    <div className="container py-8">
      <BackNavigation />
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Health Hub</h1>
          <Button onClick={handleAskProfessional}>Ask a Professional</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full justify-start mb-6">
                <TabsTrigger value="all">All Posts</TabsTrigger>
                <TabsTrigger value="fitness" className="gap-2">
                  <Heart className="w-4 h-4" />
                  Fitness
                </TabsTrigger>
                <TabsTrigger value="nutrition" className="gap-2">
                  <Apple className="w-4 h-4" />
                  Nutrition
                </TabsTrigger>
                <TabsTrigger value="mental-health" className="gap-2">
                  <Brain className="w-4 h-4" />
                  Mental Health
                </TabsTrigger>
                <TabsTrigger value="natural-remedies" className="gap-2">
                  <Leaf className="w-4 h-4" />
                  Natural Remedies
                </TabsTrigger>
                <TabsTrigger value="disease-alert" className="gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Disease Alert
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                {posts?.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </TabsContent>

              {["fitness", "nutrition", "mental-health", "natural-remedies", "disease-alert"].map(
                (tab) => (
                  <TabsContent key={tab} value={tab} className="space-y-6">
                    {posts
                      ?.filter((post) => post.title.toLowerCase().includes(tab))
                      .map((post) => (
                        <PostCard key={post.id} post={post} />
                      ))}
                  </TabsContent>
                )
              )}
            </Tabs>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-semibold mb-4">Daily Wellness Tip</h3>
              <p className="text-sm text-muted-foreground">
                Stay hydrated! Drink at least 8 glasses of water daily to maintain good health and energy levels.
              </p>
            </div>

            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-semibold mb-4">Health Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-primary hover:underline">
                    Mental Health Support Groups
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary hover:underline">
                    Fitness Training Programs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary hover:underline">
                    Nutrition Guidelines
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary hover:underline">
                    Disease Prevention Tips
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Health;