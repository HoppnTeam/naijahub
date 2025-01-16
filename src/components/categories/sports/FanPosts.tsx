import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";

interface FanPost {
  id: string;
  content: string;
  team_name: string;
  image_url: string | null;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  };
}

export const FanPosts = () => {
  const { data: fanPosts, isLoading } = useQuery({
    queryKey: ["fan-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sports_fan_posts")
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as FanPost[];
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!fanPosts || fanPosts.length === 0) {
    return <div>No fan posts yet.</div>;
  }

  return (
    <div className="space-y-4">
      {fanPosts.map((post) => (
        <Card key={post.id}>
          <CardContent className="p-4">
            <div className="flex items-start space-x-4">
              <Avatar>
                <AvatarImage src={post.profiles.avatar_url || undefined} />
                <AvatarFallback>
                  {post.profiles.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{post.profiles.username}</h3>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(post.created_at)}
                  </span>
                </div>
                <p className="mt-2">{post.content}</p>
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt="Fan post"
                    className="mt-2 rounded-lg max-h-48 object-cover"
                  />
                )}
                <p className="mt-2 text-sm text-muted-foreground">
                  Supporting: {post.team_name}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};