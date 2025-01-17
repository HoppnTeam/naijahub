import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useDraftNewsPosts } from "@/hooks/use-draft-news-posts";
import { NewsHeader } from "./NewsHeader";
import { NewsGrid } from "./NewsGrid";

export const AggregatedNewsList = () => {
  const { toast } = useToast();
  const { data: draftPosts, isLoading, refetch } = useDraftNewsPosts();

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
      <NewsHeader onFetchArticles={fetchNewArticles} />
      <NewsGrid 
        posts={draftPosts} 
        isLoading={isLoading} 
        onPublish={publishPost} 
      />
    </div>
  );
};