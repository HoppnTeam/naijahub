import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  // Fetch top contributors
  const { data: topContributors } = useQuery({
    queryKey: ["top-contributors", "news-politics"],
    queryFn: async () => {
      const { data: categoryData } = await supabase
        .from("categories")
        .select("id")
        .eq("name", "News & Politics")
        .single();

      if (!categoryData) return [];

      const { data: contributors, error } = await supabase
        .from("profiles")
        .select(`
          username,
          avatar_url,
          posts!inner (id)
        `)
        .eq("posts.category_id", categoryData.id)
        .order("posts", { ascending: false, foreignTable: "posts" })
        .limit(5);

      if (error) {
        console.error("Error fetching top contributors:", error);
        return [];
      }

      return contributors;
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
              <img
                src={contributor.avatar_url || "/placeholder.svg"}
                alt={contributor.username}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium">{contributor.username}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};