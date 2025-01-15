import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TopContributor {
  username: string;
  avatar_url: string | null;
  post_count: number;
}

export const TopContributors = () => {
  const { data: topContributors, isLoading } = useQuery({
    queryKey: ["topContributors", "entertainment"],
    queryFn: async () => {
      const { data: entertainmentCategory } = await supabase
        .from("categories")
        .select("id")
        .eq("name", "Entertainment")
        .single();

      if (!entertainmentCategory) return [];

      // Modified query to correctly count and order posts
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          username,
          avatar_url,
          post_count:posts(count)
        `)
        .eq('posts.category_id', entertainmentCategory.id)
        .order('post_count', { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching top contributors:", error);
        throw error;
      }

      return data.map(contributor => ({
        username: contributor.username,
        avatar_url: contributor.avatar_url,
        post_count: contributor.post_count[0]?.count || 0
      })) as TopContributor[];
    },
  });

  return (
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
                    {contributor.post_count} posts
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};