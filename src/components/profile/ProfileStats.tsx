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
      label: "Comments",
      value: profile.posts?.reduce((acc, post) => acc + (post._count?.comments || 0), 0) || 0,
    },
    {
      label: "Likes Received",
      value: profile.posts?.reduce((acc, post) => acc + (post._count?.likes || 0), 0) || 0,
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