import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useDraftNewsPosts } from "@/hooks/use-draft-news-posts";
import { NewsHeader } from "./NewsHeader";
import { NewsGrid } from "./NewsGrid";
import { CategorySelect } from "./CategorySelect";
import { DateScheduler } from "./DateScheduler";
import { format } from "date-fns";

export const DraftNewsManager = () => {
  const { toast } = useToast();
  const { data: draftPosts, isLoading, refetch } = useDraftNewsPosts();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [isFetching, setIsFetching] = useState(false);

  const fetchNewArticles = async () => {
    try {
      setIsFetching(true);
      console.log("Triggering news fetch from APIs...");
      
      const { data, error } = await supabase.functions.invoke("fetch-nigerian-news");

      if (error) {
        console.error("Error from edge function:", error);
        throw error;
      }

      console.log("Fetch response:", data);

      toast({
        title: "Success",
        description: data.message || "New articles have been fetched and stored",
      });

      // Refetch the draft posts to update the UI
      await refetch();
    } catch (error) {
      console.error("Error fetching news articles:", error);
      toast({
        title: "Error",
        description: "Failed to fetch new articles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };

  const publishPost = async (postId: string) => {
    try {
      const updateData: any = {
        is_draft: false,
        category_id: selectedCategory || null,
      };

      if (scheduledDate) {
        updateData.scheduled_publish_date = scheduledDate.toISOString();
        updateData.is_draft = true; // Keep as draft if scheduled
      }

      const { error } = await supabase
        .from("posts")
        .update(updateData)
        .eq("id", postId);

      if (error) throw error;

      toast({
        title: "Success",
        description: scheduledDate 
          ? `Article has been scheduled for publishing on ${format(scheduledDate, 'PPP')}` 
          : "Article has been published",
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">News Draft Management</h1>
      
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <CategorySelect 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          <DateScheduler
            scheduledDate={scheduledDate}
            onScheduledDateChange={setScheduledDate}
          />
        </div>

        <NewsHeader onFetchArticles={fetchNewArticles} isFetching={isFetching} />
        <NewsGrid 
          posts={draftPosts} 
          isLoading={isLoading || isFetching} 
          onPublish={publishPost}
        />
      </div>
    </div>
  );
};