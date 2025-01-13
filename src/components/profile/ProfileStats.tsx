import { Card, CardContent } from "@/components/ui/card";
import { ScrollText, ThumbsUp, MessageSquare, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Profile } from "@/types/profile";

interface ProfileStatsProps {
  profile: Profile;
}

export const ProfileStats = ({ profile }: ProfileStatsProps) => {
  const stats = [
    {
      label: "Posts",
      value: profile.posts?.length ?? 0,
      icon: ScrollText,
    },
    {
      label: "Total Likes",
      value: profile.posts?.reduce((acc, post) => acc + (post.likes?.length ?? 0), 0) ?? 0,
      icon: ThumbsUp,
    },
    {
      label: "Total Comments",
      value: profile.posts?.reduce((acc, post) => acc + (post.comments?.length ?? 0), 0) ?? 0,
      icon: MessageSquare,
    },
    {
      label: "Member Since",
      value: formatDistanceToNow(new Date(profile.created_at), { addSuffix: true }),
      icon: Calendar,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="flex items-center p-4">
            <stat.icon className="h-5 w-5 text-muted-foreground mr-2" />
            <div>
              <p className="text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};