import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const PostDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: post, refetch: refetchPost } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles (username, avatar_url),
          categories (name),
          comments (
            *,
            profiles (username, avatar_url)
          ),
          likes (user_id)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to like posts",
        variant: "destructive",
      });
      return;
    }

    const isLiked = post?.likes?.some((like) => like.user_id === user.id);

    if (isLiked) {
      await supabase
        .from("likes")
        .delete()
        .match({ post_id: id, user_id: user.id });
    } else {
      await supabase
        .from("likes")
        .insert({ post_id: id, user_id: user.id });
    }

    refetchPost();
  };

  const handleComment = async (content: string) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to comment",
        variant: "destructive",
      });
      return;
    }

    await supabase
      .from("comments")
      .insert({ post_id: id, user_id: user.id, content });

    refetchPost();
  };

  if (!post) return <div className="container py-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4 mb-4">
              <Avatar>
                <AvatarImage src={post.profiles?.avatar_url ?? undefined} />
                <AvatarFallback>
                  {post.profiles?.username?.substring(0, 2).toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold">{post.profiles?.username}</h2>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
            {post.categories?.name && (
              <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                {post.categories.name}
              </span>
            )}
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none mb-6">
              {post.content}
            </div>
            <div className="flex gap-4 mb-8">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={post.likes?.some((like) => like.user_id === user?.id) ? "text-primary" : ""}
              >
                <ThumbsUp className="mr-2 h-4 w-4" />
                {post.likes?.length ?? 0}
              </Button>
              <Button variant="ghost" size="sm">
                <MessageSquare className="mr-2 h-4 w-4" />
                {post.comments?.length ?? 0}
              </Button>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Comments</h3>
              {post.comments?.map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={comment.profiles?.avatar_url ?? undefined} />
                        <AvatarFallback>
                          {comment.profiles?.username?.substring(0, 2).toUpperCase() ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{comment.profiles?.username}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p>{comment.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostDetails;