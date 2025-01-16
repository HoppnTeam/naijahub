import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface TeamFollow {
  id: string;
  team_name: string;
  league: string;
  reason: string | null;
}

export const TeamFollowsList = () => {
  const { data: teamFollows } = useQuery({
    queryKey: ["team-follows"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sports_team_follows")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as TeamFollow[];
    },
  });

  if (!teamFollows || teamFollows.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="font-semibold mb-2">Your Team Follows</h3>
      <div className="space-y-2">
        {teamFollows.map((follow) => (
          <Card key={follow.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{follow.team_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {follow.league}
                  </p>
                  {follow.reason && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {follow.reason}
                    </p>
                  )}
                </div>
                <Trophy className="h-4 w-4 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};