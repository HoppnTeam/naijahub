import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: string;
  name: string;
}

interface TopContributor {
  username: string;
  avatar_url: string | null;
  post_count: number;
}

interface NewsSidebarProps {
  subcategories?: Category[];
  onSubcategorySelect?: (subcategoryId: string | null) => void;
}

export const NewsSidebar = ({ subcategories, onSubcategorySelect }: NewsSidebarProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentSubcategory = searchParams.get('subcategory');

  // Fetch top contributors (users with most posts in News & Politics category)
  const { data: topContributors } = useQuery({
    queryKey: ["top-contributors", "news-politics"],
    queryFn: async () => {
      const { data: categoryId } = await supabase
        .from("categories")
        .select("id")
        .eq("name", "News & Politics")
        .single();

      if (!categoryId) return [];

      const { data } = await supabase
        .from("profiles")
        .select(`
          username,
          avatar_url,
          posts:posts(count)
        `)
        .eq("posts.category_id", categoryId.id)
        .order("posts.count", { ascending: false })
        .limit(5);

      return (data || []).map(user => ({
        username: user.username,
        avatar_url: user.avatar_url,
        post_count: user.posts?.[0]?.count || 0
      })) as TopContributor[];
    }
  });

  // Fetch related categories
  const { data: relatedCategories } = useQuery({
    queryKey: ["related-categories"],
    queryFn: async () => {
      const { data } = await supabase
        .from("categories")
        .select("id, name")
        .in("name", ["Technology", "Business", "International"])
        .limit(3);
      return data || [];
    }
  });

  const handleContributorClick = (username: string) => {
    // Navigate to the user's profile page
    navigate(`/profile?username=${username}`);
  };

  const handleRelatedCategoryClick = (categoryName: string) => {
    const categoryPaths: { [key: string]: string } = {
      "Technology": "/categories/technology",
      "Business": "/categories/business",
      "International": "/categories/news-politics?subcategory=international"
    };
    navigate(categoryPaths[categoryName] || "/");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            key="all"
            variant={!currentSubcategory ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onSubcategorySelect?.(null)}
          >
            All News
          </Button>
          {subcategories?.map((subcategory) => (
            <Button
              key={subcategory.id}
              variant={currentSubcategory === subcategory.id ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => onSubcategorySelect?.(subcategory.id)}
            >
              {subcategory.name}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Contributors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {topContributors?.map((contributor) => (
            <Button
              key={contributor.username}
              variant="ghost"
              className="w-full flex items-center justify-between p-2 hover:bg-accent"
              onClick={() => handleContributorClick(contributor.username)}
            >
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={contributor.avatar_url ?? undefined} />
                  <AvatarFallback>
                    {contributor.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>{contributor.username}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>{contributor.post_count} posts</span>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Related Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {relatedCategories?.map((category) => (
              <Button
                key={category.id}
                variant="outline"
                size="sm"
                onClick={() => handleRelatedCategoryClick(category.name)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};