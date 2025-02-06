import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LeaderboardEntry {
  username: string;
  avatar_url: string | null;
  points: number;
  level: number;
  rank: number;
}

export const LeaderboardTab = () => {
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_weekly_leaderboard');
      if (error) throw error;
      return data as LeaderboardEntry[];
    },
  });

  if (isLoading) {
    return <div className="text-center p-4">Loading leaderboard...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold mb-4">Weekly Leaderboard</h3>
      <div className="space-y-2">
        {leaderboard?.map((entry) => (
          <Card key={entry.username} className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-8 text-center font-bold">
                {entry.rank <= 3 ? (
                  <Trophy className={`w-6 h-6 mx-auto ${
                    entry.rank === 1 ? 'text-yellow-500' :
                    entry.rank === 2 ? 'text-gray-400' :
                    'text-amber-600'
                  }`} />
                ) : (
                  `#${entry.rank}`
                )}
              </div>
              <Avatar className="h-10 w-10">
                <AvatarImage src={entry.avatar_url || undefined} />
                <AvatarFallback>
                  {entry.username?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <div className="font-semibold">{entry.username}</div>
                <div className="text-sm text-muted-foreground">
                  Level {entry.level}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">{entry.points}</div>
                <div className="text-sm text-muted-foreground">points</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};