import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const { id } = useParams();

  const { data: profile } = useQuery({
    queryKey: ["profile", id],
    queryFn: async () => {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select(`
          *,
          posts (
            *,
            categories (name),
            likes (user_id),
            comments (id)
          )
        `)
        .eq("user_id", id)
        .single();

      if (profileError) throw profileError;
      return profileData;
    },
  });

  if (!profile) return <div className="container py-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="flex items-center gap-6 mb-8">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile.avatar_url ?? undefined} />
            <AvatarFallback>
              {profile.username?.substring(0, 2).toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-4xl font-bold mb-2">{profile.username}</h1>
            {profile.bio && (
              <p className="text-muted-foreground max-w-md">{profile.bio}</p>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              Joined {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Posts</h2>
          {profile.posts?.map((post) => (
            <Card key={post.id} className="hover:bg-muted/50 transition-colors">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold hover:text-primary">
                    <a href={`/posts/${post.id}`}>{post.title}</a>
                  </h3>
                  {post.categories?.name && (
                    <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                      {post.categories.name}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {post.content.substring(0, 200)}
                  {post.content.length > 200 ? "..." : ""}
                </p>
                <div className="flex gap-4">
                  <Button variant="ghost" size="sm">
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    {post.likes?.length ?? 0}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {post.comments?.length ?? 0}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;