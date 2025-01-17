import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Post } from "@/types/post";
import { NewsCard } from "./NewsCard";
import { NewsFetchButton } from "./NewsFetchButton";

interface NewsPost extends Post {
  categories: {
    name: string;
  } | null;
}

export const AggregatedNewsList = () => {
  const { toast } = useToast();

  const { data: draftPosts, isLoading, refetch } = useQuery({
    queryKey: ["draft-news-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          categories (name)
        `)
        .eq("is_draft", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching draft posts:", error);
        throw error;
      }

      return data as NewsPost[];
    },
  });

  const fetchNewArticles = async () => {
    try {
      const { error } = await supabase.functions.invoke("fetch-nigerian-news");
      if (error) throw error;

      toast({
        title: "Success",
        description: "New articles have been fetched and stored",
      });

      refetch();
    } catch (error) {
      console.error("Error fetching new articles:", error);
      toast({
        title: "Error",
        description: "Failed to fetch new articles",
        variant: "destructive",
      });
    }
  };

  const publishPost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from("posts")
        .update({ is_draft: false })
        .eq("id", postId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Article has been published",
      });

      refetch();
    } catch (error) {
      console.error("Error publishing article:", error);
      toast({
        title: "Error",
        description: "Failed to publish article",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Aggregated News</h2>
        <NewsFetchButton onClick={fetchNewArticles} />
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-6">
          {draftPosts?.map((post) => (
            <NewsCard key={post.id} post={post} onPublish={publishPost} />
          ))}
        </div>
      )}
    </div>
  );
};