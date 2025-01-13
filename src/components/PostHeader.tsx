import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface PostHeaderProps {
  profile: {
    username?: string;
    avatar_url?: string;
  };
  title: string;
  created_at: string;
  category?: {
    name: string;
  };
}

export const PostHeader = ({
  profile,
  title,
  created_at,
  category,
}: PostHeaderProps) => {
  return (
    <>
      <div className="flex items-center gap-4 mb-4">
        <Avatar>
          <AvatarImage src={profile?.avatar_url ?? undefined} />
          <AvatarFallback>
            {profile?.username?.substring(0, 2).toUpperCase() ?? "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{profile?.username}</p>
          <p className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(created_at), {
              addSuffix: true,
            })}
          </p>
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      {category?.name && (
        <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
          {category.name}
        </span>
      )}
    </>
  );
};