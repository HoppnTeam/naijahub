import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Post } from "@/types/post";
import { PostCard } from "@/components/PostCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wheat, Tractor, Sprout, Package, Users, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Agriculture = () => {
  const { toast } = useToast();
  const { data: posts, isLoading } = useQuery({
    queryKey: ["agriculture-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles (username, avatar_url),
          categories (name),
          likes (count),
          comments (count)
        `)
        .eq("categories.name", "Agriculture")
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

  const subcategories = [
    "All",
    "Organic Farming",
    "Farm Inputs",
    "How to Start a FARM",
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <Wheat className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold">Agriculture Hub</h1>
          </div>

          <Tabs defaultValue="All" className="mb-8">
            <TabsList className="w-full overflow-x-auto flex whitespace-nowrap">
              {subcategories.map((sub) => (
                <TabsTrigger key={sub} value={sub} className="flex-shrink-0">
                  {sub}
                </TabsTrigger>
              ))}
            </TabsList>

            {subcategories.map((sub) => (
              <TabsContent key={sub} value={sub}>
                {isLoading ? (
                  <div>Loading...</div>
                ) : (
                  <div className="grid gap-6">
                    {posts?.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Farmers' Corner */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Farmers' Corner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Join discussions on farming best practices and innovations
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => toast({
                  title: "Coming Soon",
                  description: "Farmers' Corner will be available soon!"
                })}
              >
                Join Discussion
              </Button>
            </CardContent>
          </Card>

          {/* Marketplace */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Agro Marketplace
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Buy and sell agricultural products, seeds, and equipment
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => toast({
                  title: "Coming Soon",
                  description: "Marketplace features will be available soon!"
                })}
              >
                Visit Marketplace
              </Button>
            </CardContent>
          </Card>

          {/* Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li>
                  <Button 
                    variant="link" 
                    className="text-left w-full"
                    onClick={() => toast({
                      title: "Coming Soon",
                      description: "Training resources will be available soon!"
                    })}
                  >
                    🌱 Agricultural Training Programs
                  </Button>
                </li>
                <li>
                  <Button 
                    variant="link" 
                    className="text-left w-full"
                    onClick={() => toast({
                      title: "Coming Soon",
                      description: "Grant information will be available soon!"
                    })}
                  >
                    💰 Available Grants
                  </Button>
                </li>
                <li>
                  <Button 
                    variant="link" 
                    className="text-left w-full"
                    onClick={() => toast({
                      title: "Coming Soon",
                      description: "Expert consultations will be available soon!"
                    })}
                  >
                    👨‍🌾 Expert Consultation
                  </Button>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Agriculture;