import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const { id } = useParams();

  const { data: profile } = useQuery({
    queryKey: ["profile", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          posts (*)
        `)
        .eq("user_id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-4">{profile.username}</h1>
        {profile.bio && (
          <p className="text-muted-foreground mb-8">{profile.bio}</p>
        )}
      </div>
    </div>
  );
};

export default Profile;