import { Card, CardContent } from "@/components/ui/card";
import { Profile } from "@/types/profile";

interface ProfileStatsProps {
  profile: Profile;
}

export const ProfileStats = ({ profile }: ProfileStatsProps) => {
  const stats = [
    {
      label: "Posts",
      value: profile.posts?.length || 0,
    },
    {
      label: "Level",
      value: profile.level || 1,
    },
    {
      label: "Points",
      value: profile.points || 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};