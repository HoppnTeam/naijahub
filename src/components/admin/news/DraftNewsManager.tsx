import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useDraftNewsPosts } from "@/hooks/use-draft-news-posts";
import { NewsHeader } from "./NewsHeader";
import { NewsGrid } from "./NewsGrid";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const DraftNewsManager = () => {
  const { toast } = useToast();
  const { data: draftPosts, isLoading, refetch } = useDraftNewsPosts();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [scheduledDate, setScheduledDate] = useState<Date>();

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
      console.error("Error fetching news articles:", error);
      toast({
        title: "Error",
        description: "Failed to fetch new articles",
        variant: "destructive",
      });
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
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="news">News</SelectItem>
              <SelectItem value="politics">Politics</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !scheduledDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {scheduledDate ? format(scheduledDate, "PPP") : "Schedule post"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={scheduledDate}
                onSelect={setScheduledDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button 
            variant="outline"
            onClick={() => setScheduledDate(undefined)}
            className="ml-2"
          >
            Clear Schedule
          </Button>
        </div>

        <NewsHeader onFetchArticles={fetchNewArticles} />
        <NewsGrid 
          posts={draftPosts} 
          isLoading={isLoading} 
          onPublish={publishPost}
        />
      </div>
    </div>
  );
};