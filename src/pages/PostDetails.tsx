import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { PostHeader } from "@/components/PostHeader";
import { PostActions } from "@/components/PostActions";
import { CommentsList } from "@/components/CommentsList";
import { PostSkeleton } from "@/components/PostSkeleton";

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
        <PostSkeleton />
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
          <PostHeader
            profile={post.profiles}
            title={post.title}
            created_at={post.created_at}
            category={post.categories}
          />
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
        <CardFooter>
          <PostActions
            likesCount={post.likes?.length ?? 0}
            commentsCount={post.comments?.length ?? 0}
            isLiked={isLiked}
            onLike={handleLike}
          />
        </CardFooter>
      </Card>

      <CommentsList comments={post.comments} />
    </div>
  );
};

export default PostDetails;