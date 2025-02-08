
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { CardHeader, CardTitle } from "@/components/ui/card";

interface DesignerHeaderProps {
  businessName: string;
  location: string;
  verified: boolean;
  avatarUrl: string | null;
  username: string;
}

export const DesignerHeader = ({
  businessName,
  location,
  verified,
  avatarUrl,
  username
}: DesignerHeaderProps) => {
  return (
    <CardHeader className="flex flex-row items-center gap-4">
      <ProfileAvatar 
        avatarUrl={avatarUrl} 
        username={username}
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">{businessName}</CardTitle>
          {verified && (
            <Badge variant="secondary" className="ml-2">Verified</Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground mt-1">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>
      </div>
    </CardHeader>
  );
};
