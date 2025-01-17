import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileAvatarProps {
  avatarUrl?: string | null;
  username?: string;
}

export const ProfileAvatar = ({ avatarUrl, username }: ProfileAvatarProps) => {
  return (
    <Avatar className="cursor-pointer">
      <AvatarImage src={avatarUrl ?? undefined} />
      <AvatarFallback>
        {username?.substring(0, 2).toUpperCase() ?? "U"}
      </AvatarFallback>
    </Avatar>
  );
};