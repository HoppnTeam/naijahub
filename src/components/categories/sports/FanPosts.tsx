import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface FanPost {
  id: string;
  content: string;
  team_name: string;
  image_url: string | null;
  created_at: string;
  user_id: string;
  user: {
    username: string;
    avatar_url: string | null;
  };
}

export const FanPosts = () => {
  const { data: posts } = useQuery({
    queryKey: ["fan-posts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("sports_fan_posts")
        .select(`
          *,
          user:profiles!sports_fan_posts_user_id_fkey (username, avatar_url)
        `)
        .order("created_at", { ascending: false });

      return data as FanPost[];
    },
  });

  if (!posts) return null;

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="border p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <img
              src={post.user.avatar_url || "/placeholder.svg"}
              alt={post.user.username}
              className="w-8 h-8 rounded-full"
            />
            <span className="font-medium">{post.user.username}</span>
          </div>
          <p className="text-sm text-gray-600 mb-2">Team: {post.team_name}</p>
          <p>{post.content}</p>
          {post.image_url && (
            <img
              src={post.image_url}
              alt="Fan post"
              className="mt-2 rounded-lg max-h-48 object-cover"
            />
          )}
        </div>
      ))}
    </div>
  );
};