import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface FanPost {
  id: string;
  content: string;
  team_name: string;
  image_url: string | null;
  created_at: string;
  user_id: string;
  user: {
    username: string;
    avatar_url: string;
  };
}

export const FanPosts = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["fan-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sports_fan_posts")
        .select(`
          *,
          user:profiles!sports_fan_posts_user_id_fkey (
            username,
            avatar_url
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as FanPost[];
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (!posts?.length) return <div>No fan posts yet.</div>;

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <img
              src={post.user.avatar_url || "/placeholder.svg"}
              alt={post.user.username}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="font-semibold">{post.user.username}</p>
              <p className="text-sm text-gray-500">
                {format(new Date(post.created_at), "PPp")}
              </p>
            </div>
          </div>
          <p className="mb-2">{post.content}</p>
          {post.image_url && (
            <img
              src={post.image_url}
              alt="Fan post"
              className="rounded-lg max-h-96 w-full object-cover"
            />
          )}
          <p className="text-sm text-gray-500 mt-2">Team: {post.team_name}</p>
        </div>
      ))}
    </div>
  );
};