import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TopContributor {
  username: string;
  avatar_url: string | null;
  posts: { count: number }[];
}

interface EntertainmentSidebarProps {
  subcategories?: { id: string; name: string }[];
  selectedSubcategoryId?: string;
  onSubcategorySelect: (id: string) => void;
}

export const EntertainmentSidebar = ({
  subcategories,
  selectedSubcategoryId,
  onSubcategorySelect,
}: EntertainmentSidebarProps) => {
  const { data: topContributors, isLoading } = useQuery({
    queryKey: ["topContributors", "entertainment"],
    queryFn: async () => {
      // First get the Entertainment category ID
      const { data: entertainmentCategory } = await supabase
        .from("categories")
        .select("id")
        .eq("name", "Entertainment")
        .single();

      if (!entertainmentCategory) return [];

      // Then get profiles with post counts for this category
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          username,
          avatar_url,
          posts:posts(count)
        `)
        .eq("posts.category_id", entertainmentCategory.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching top contributors:", error);
        throw error;
      }

      return data as TopContributor[];
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Top Contributors</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading contributors...</div>
          ) : (
            <div className="space-y-4">
              {topContributors?.map((contributor) => (
                <div
                  key={contributor.username}
                  className="flex items-center gap-3"
                >
                  <Avatar>
                    <AvatarImage src={contributor.avatar_url || ""} />
                    <AvatarFallback>
                      {contributor.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{contributor.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {contributor.posts[0]?.count || 0} posts
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {subcategories && subcategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Entertainment Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {subcategories.map((subcategory) => (
                <Button
                  key={subcategory.id}
                  variant={
                    selectedSubcategoryId === subcategory.id
                      ? "default"
                      : "outline"
                  }
                  onClick={() => onSubcategorySelect(subcategory.id)}
                  className="justify-start"
                >
                  {subcategory.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};