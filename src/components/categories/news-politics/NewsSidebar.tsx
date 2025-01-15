import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Profile {
  username: string;
  avatar_url: string | null;
  posts: any[];
}

interface NewsSidebarProps {
  subcategories?: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
  onSubcategorySelect: (subcategoryId: string) => void;
}

export const NewsSidebar = ({ 
  subcategories,
  onSubcategorySelect 
}: NewsSidebarProps) => {
  const { data: topContributors } = useQuery<Profile[]>({
    queryKey: ["top-contributors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          username,
          avatar_url,
          posts!inner (id)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Subcategories</h3>
        <div className="space-y-2">
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
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-4">Top Contributors</h3>
        <div className="space-y-4">
          {topContributors?.map((profile) => (
            <div key={profile.username} className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile.avatar_url || ''} />
                <AvatarFallback>
                  {profile.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{profile.username}</p>
                <p className="text-xs text-muted-foreground">
                  {profile.posts?.length || 0} posts
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};