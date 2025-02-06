import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Award, MapPin, Mail, Phone } from "lucide-react";
import { FollowButton } from "@/components/FollowButton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";
import { formatDistanceToNow } from "date-fns";

interface ProfileModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal = ({ userId, isOpen, onClose }: ProfileModalProps) => {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
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
      return data as Profile;
    },
    enabled: isOpen,
  });

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>

        {profile && (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatar_url ?? undefined} />
                <AvatarFallback>
                  {profile.username?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">{profile.username}</h2>
                    <p className="text-sm text-muted-foreground">
                      Joined {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <FollowButton targetUserId={profile.user_id} />
                </div>
                {profile.location && (
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {profile.location}
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <div>
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-muted-foreground">{profile.bio}</p>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{profile.followers_count}</div>
                  <div className="text-sm text-muted-foreground">Followers</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{profile.points}</div>
                  <div className="text-sm text-muted-foreground">Points</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{profile.level}</div>
                  <div className="text-sm text-muted-foreground">Level</div>
                </CardContent>
              </Card>
            </div>

            {/* Achievements */}
            {profile.user_achievements?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Achievements</h3>
                <div className="grid gap-2">
                  {profile.user_achievements.map((ua, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">{ua.achievements.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {ua.achievements.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Info */}
            {(profile.contact_email || profile.phone_number) && (
              <div>
                <h3 className="font-semibold mb-2">Contact</h3>
                <div className="space-y-2">
                  {profile.contact_email && (
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a href={`mailto:${profile.contact_email}`} className="hover:text-primary">
                        {profile.contact_email}
                      </a>
                    </div>
                  )}
                  {profile.phone_number && (
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{profile.phone_number}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};