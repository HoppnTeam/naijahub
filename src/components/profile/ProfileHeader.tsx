import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProfileEditForm } from "@/components/ProfileEditForm";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, Phone, Heart, Activity } from "lucide-react";
import { Profile } from "@/types/profile";
import { formatDistanceToNow } from "date-fns";

interface ProfileHeaderProps {
  profile: Profile;
  isProfileEmpty: boolean;
}

export const ProfileHeader = ({ profile, isProfileEmpty }: ProfileHeaderProps) => {
  const joinedDate = new Date(profile.created_at);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-start gap-6 mb-6">
        <div className="flex flex-col items-center space-y-2">
          <Avatar className="h-32 w-32">
            <AvatarImage src={profile.avatar_url ?? undefined} alt={profile.username} />
            <AvatarFallback>
              {profile.username?.substring(0, 2).toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            Joined {formatDistanceToNow(joinedDate, { addSuffix: true })}
          </span>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold">{profile.username}</h1>
              {profile.location && (
                <div className="flex items-center text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{profile.location}</span>
                </div>
              )}
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  {isProfileEmpty ? "Complete Profile" : "Edit Profile"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>
                    {isProfileEmpty ? "Complete Your Profile" : "Edit Profile"}
                  </DialogTitle>
                </DialogHeader>
                <ProfileEditForm 
                  initialData={profile}
                  userId={profile.user_id}
                />
              </DialogContent>
            </Dialog>
          </div>
          
          {profile.bio && (
            <div className="prose max-w-none mb-6">
              <p className="text-muted-foreground">{profile.bio}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground">Contact Information</h3>
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

            {profile.interests && profile.interests.length > 0 && (
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center">
                      <Heart className="h-3 w-3 mr-1" />
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {profile.community_intent && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                Community Goals
              </h3>
              <p className="text-muted-foreground">{profile.community_intent}</p>
            </div>
          )}

          {isProfileEmpty && (
            <div className="bg-muted/50 p-4 rounded-lg mt-4">
              <p className="text-muted-foreground">
                Your profile is empty. Click "Complete Profile" to add more information about yourself.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};