import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Share2 } from "lucide-react";

type FanPost = {
  id: string;
  user_id: string;
  team_name: string;
  content: string;
  image_url: string | null;
  created_at: string;
  profiles: {
    username: string | null;
    avatar_url: string | null;
  };
};

export const FanPosts = () => {
  const { data: fanPosts } = useQuery<FanPost[]>({
    queryKey: ["fan-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sports_fan_posts")
        .select(`
          *,
          profiles:user_id(username, avatar_url)
        `)
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Recent Fan Posts</h3>
      {fanPosts?.map((post) => (
        <Card key={post.id} className="hover:bg-muted/50 transition-colors">
          <CardContent className="pt-4">
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src={post.profiles?.avatar_url || ""} />
                <AvatarFallback>
                  {post.profiles?.username?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold">{post.team_name}</p>
                <p className="text-sm text-muted-foreground">{post.content}</p>
                {post.image_url && (
                  <img 
                    src={post.image_url} 
                    alt="Fan post" 
                    className="mt-2 rounded-lg max-h-48 object-cover"
                  />
                )}
                <div className="flex gap-4 mt-2">
                  <Button variant="ghost" size="sm">
                    <Heart className="mr-2 h-4 w-4" />
                    Like
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Comment
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};