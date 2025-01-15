import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Heart, MessageSquare, Share2, Star } from "lucide-react";

interface CelebrityPost {
  id: string;
  user_id: string;
  celebrity_name: string;
  content: string;
  image_url: string | null;
  post_type: string | null;
  created_at: string;
  user: {
    username: string | null;
    avatar_url: string | null;
  }
}

export const CelebrityCorner = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newCelebrity, setNewCelebrity] = useState("");
  const [followReason, setFollowReason] = useState("");

  const { data: celebrityFollows, refetch: refetchFollows } = useQuery({
    queryKey: ["celebrity-follows"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("celebrity_follows")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: celebrityPosts } = useQuery<CelebrityPost[]>({
    queryKey: ["celebrity-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("celebrity_posts")
        .select(`
          *,
          user:profiles(username, avatar_url)
        `)
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
  });

  const handleFollow = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to follow celebrities",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("celebrity_follows").insert([
        {
          user_id: user.id,
          celebrity_name: newCelebrity,
          reason: followReason,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: `You are now following ${newCelebrity}`,
      });

      setNewCelebrity("");
      setFollowReason("");
      refetchFollows();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to follow celebrity. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Celebrity Corner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Enter celebrity name"
                value={newCelebrity}
                onChange={(e) => setNewCelebrity(e.target.value)}
              />
              <Textarea
                placeholder="Why do you follow them?"
                value={followReason}
                onChange={(e) => setFollowReason(e.target.value)}
              />
              <Button 
                onClick={handleFollow}
                className="w-full"
                disabled={!newCelebrity}
              >
                <Star className="mr-2 h-4 w-4" />
                Follow Celebrity
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Recent Fan Posts</h3>
              {celebrityPosts?.map((post) => (
                <Card key={post.id} className="hover:bg-muted/50 transition-colors">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={post.user?.avatar_url || ""} />
                        <AvatarFallback>
                          {post.user?.username?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold">{post.celebrity_name}</p>
                        <p className="text-sm text-muted-foreground">{post.content}</p>
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

            {celebrityFollows && celebrityFollows.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Your Celebrity Follows</h3>
                <div className="space-y-2">
                  {celebrityFollows.map((follow) => (
                    <Card key={follow.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{follow.celebrity_name}</p>
                            {follow.reason && (
                              <p className="text-sm text-muted-foreground">
                                {follow.reason}
                              </p>
                            )}
                          </div>
                          <Star className="h-4 w-4 text-yellow-500" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};