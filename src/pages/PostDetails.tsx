import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { PostHeader } from "@/components/PostHeader";
import { PostActions } from "@/components/PostActions";
import { CommentsList } from "@/components/CommentsList";
import { PostSkeleton } from "@/components/PostSkeleton";
import { ProfileModal } from "@/components/profile/ProfileModal";
import { useState } from "react";
import { UserCircle } from "lucide-react";

const PostDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const { data: post, isLoading: isLoadingPost } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const { data: post, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles (username, avatar_url, user_id),
          categories!posts_category_id_fkey (name),
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

    try {
      if (isLiked) {
        const { error } = await supabase
          .from("likes")
          .delete()
          .eq("post_id", id)
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("likes")
          .insert({ post_id: id, user_id: user.id });

        if (error) throw error;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not update like status",
        variant: "destructive",
      });
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
          <div className="flex justify-between items-start">
            <PostHeader
              profile={post.profiles}
              title={post.title}
              created_at={post.created_at}
              category={post.categories}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2"
            >
              <UserCircle className="h-4 w-4" />
              View Profile
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {post.image_url && (
            <div className="mb-6">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full max-h-[600px] object-contain rounded-lg"
              />
            </div>
          )}
          <p className="whitespace-pre-wrap">{post.content}</p>
        </CardContent>
        <CardFooter>
          <PostActions
            postId={post.id}
            initialLikesCount={post.likes?.length ?? 0}
            commentsCount={post.comments?.length ?? 0}
            isLiked={isLiked}
            onLikeToggle={handleLike}
          />
        </CardFooter>
      </Card>

      <CommentsList comments={post.comments} />

      {post.profiles && (
        <ProfileModal
          userId={post.profiles.user_id}
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PostDetails;