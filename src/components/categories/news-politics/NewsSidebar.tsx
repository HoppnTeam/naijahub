import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Category {
  id: string;
  name: string;
  parent_id: string | null;
}

interface NewsSidebarProps {
  subcategories?: Category[];
  onSubcategorySelect: (subcategoryId: string | null) => void;
}

export const NewsSidebar = ({ 
  subcategories,
  onSubcategorySelect 
}: NewsSidebarProps) => {
  // Fetch top contributors with corrected query
  const { data: topContributors } = useQuery({
    queryKey: ["top-contributors", "news-politics"],
    queryFn: async () => {
      const { data: categoryData } = await supabase
        .from("categories")
        .select("id")
        .eq("name", "News & Politics")
        .single();

      if (!categoryData) return [];

      // Modified query to correctly count posts and order by post count
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          username,
          avatar_url,
          posts!inner (id)
        `)
        .eq("posts.category_id", categoryData.id)
        .order("posts.id", { foreignTable: "posts", ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching top contributors:", error);
        return [];
      }

      return data.map(contributor => ({
        username: contributor.username,
        avatar_url: contributor.avatar_url,
        post_count: contributor.posts?.length || 0
      }));
    },
  });

  return (
    <aside className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Categories</h3>
        <ScrollArea className="h-[300px]">
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => onSubcategorySelect(null)}
            >
              All News
            </Button>
            {subcategories?.map((subcategory) => (
              <Button
                key={subcategory.id}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => onSubcategorySelect(subcategory.id)}
              >
                {subcategory.name}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Top Contributors</h3>
        <div className="space-y-4">
          {topContributors?.map((contributor) => (
            <div key={contributor.username} className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={contributor.avatar_url || ""} />
                <AvatarFallback>
                  {contributor.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{contributor.username}</p>
                <p className="text-sm text-muted-foreground">
                  {contributor.post_count} posts
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};