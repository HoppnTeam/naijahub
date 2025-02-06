import { Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: string;
  earned_at: string;
}

interface AchievementsTabProps {
  userId: string;
}

export const AchievementsTab = ({ userId }: AchievementsTabProps) => {
  const { data: achievements, isLoading } = useQuery({
    queryKey: ["achievements", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_achievements")
        .select(`
          achievement_id,
          earned_at,
          achievements (
            id,
            name,
            description,
            icon,
            type
          )
        `)
        .eq("user_id", userId);

      if (error) throw error;

      return data.map((item) => ({
        ...item.achievements,
        earned_at: item.earned_at,
      })) as Achievement[];
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  if (!achievements?.length) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        <Award className="mx-auto mb-2 h-8 w-8" />
        <p>No achievements yet</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {achievements.map((achievement) => (
        <Card key={achievement.id} className="p-4">
          <div className="flex items-start gap-3">
            <Award className="h-8 w-8 flex-shrink-0 text-primary" />
            <div>
              <h4 className="font-semibold">{achievement.name}</h4>
              <p className="text-sm text-muted-foreground">
                {achievement.description}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Earned on{" "}
                {new Date(achievement.earned_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};