import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw } from "lucide-react";
import { Post } from "@/types/post";

interface NewsPost extends Omit<Post, 'categories'> {
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

      if (error) throw error;
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
        <Button onClick={fetchNewArticles} className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Fetch New Articles
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-6">
          {draftPosts?.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <CardTitle className="text-xl">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">{post.content}</p>
                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-md"
                    />
                  )}
                  <div className="flex justify-end gap-4">
                    {post.source_url && (
                      <Button
                        variant="outline"
                        onClick={() => window.open(post.source_url, "_blank")}
                      >
                        View Original
                      </Button>
                    )}
                    <Button onClick={() => publishPost(post.id)}>
                      Publish Article
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};