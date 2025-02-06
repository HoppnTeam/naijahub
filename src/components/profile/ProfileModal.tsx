import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Mail, Phone, Award, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FollowButton } from "../FollowButton";

interface ProfileModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal = ({ userId, isOpen, onClose }: ProfileModalProps) => {
  const { data: profile } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select(`
          *,
          followers (count),
          user_achievements (
            achievements (
              name,
              description,
              icon
            )
          )
        `)
        .eq("user_id", userId)
        .single();

      if (error) throw error;
      return profile;
    },
    enabled: isOpen,
  });

  if (!profile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback>
                  {profile.username?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{profile.username}</h2>
                <p className="text-sm text-muted-foreground">
                  Joined{" "}
                  {formatDistanceToNow(new Date(profile.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            <FollowButton targetUserId={userId} />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 py-4">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {profile.followers?.[0]?.count || 0}
              </div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{profile.points || 0}</div>
              <div className="text-sm text-muted-foreground">Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{profile.level || 1}</div>
              <div className="text-sm text-muted-foreground">Level</div>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="py-4">
              <p className="text-sm">{profile.bio}</p>
            </div>
          )}

          {/* Achievements */}
          {profile.user_achievements && profile.user_achievements.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Achievements</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.user_achievements.map((ua: any) => (
                  <Badge
                    key={ua.achievements.name}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {ua.achievements.icon && (
                      <span className="text-lg">{ua.achievements.icon}</span>
                    )}
                    {ua.achievements.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Contact & Location */}
          <div className="space-y-2">
            {profile.contact_email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4" />
                <span>{profile.contact_email}</span>
              </div>
            )}
            {profile.phone_number && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4" />
                <span>{profile.phone_number}</span>
              </div>
            )}
            {profile.location && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                <span>{profile.location}</span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};