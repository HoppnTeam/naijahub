import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const PostDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: post, isLoading: isLoadingPost } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const { data: post, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles (username, avatar_url),
          categories (name),
          likes (user_id),
          comments (
            id,
            content,
            created_at,
            user_id,
            profiles (username, avatar_url)
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return post;
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
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("post_id", id)
        .eq("user_id", user.id);

      if (error) {
        toast({
          title: "Error",
          description: "Could not unlike the post",
          variant: "destructive",
        });
        return;
      }
    } else {
      const { error } = await supabase
        .from("likes")
        .insert({ post_id: id, user_id: user.id });

      if (error) {
        toast({
          title: "Error",
          description: "Could not like the post",
          variant: "destructive",
        });
        return;
      }
    }
  };

  if (isLoadingPost) {
    return (
      <div className="container max-w-4xl py-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <div className="flex items-center gap-2 mt-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold">Post not found</h1>
      </div>
    );
  }

  const isLiked = post.likes?.some((like) => like.user_id === user?.id);

  return (
    <div className="container max-w-4xl py-8">
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
              <p className="font-semibold">{post.profiles?.username}</p>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), {
                  addSuffix: true,
                })}
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
          {post.image_url && (
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}
          <p className="whitespace-pre-wrap">{post.content}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={isLiked ? "text-primary" : ""}
          >
            <ThumbsUp className="mr-2 h-4 w-4" />
            {post.likes?.length ?? 0}
          </Button>
          <Button variant="ghost" size="sm">
            <MessageSquare className="mr-2 h-4 w-4" />
            {post.comments?.length ?? 0}
          </Button>
        </CardFooter>
      </Card>

      {/* Comments Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        <div className="space-y-4">
          {post.comments?.map((comment) => (
            <Card key={comment.id}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src={comment.profiles?.avatar_url ?? undefined}
                    />
                    <AvatarFallback>
                      {comment.profiles?.username
                        ?.substring(0, 2)
                        .toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">
                      {comment.profiles?.username}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p>{comment.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;