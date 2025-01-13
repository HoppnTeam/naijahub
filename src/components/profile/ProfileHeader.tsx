import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProfileEditForm } from "@/components/ProfileEditForm";
import { Badge } from "@/components/ui/badge";
import { Heart, Mail, MapPin, Phone } from "lucide-react";
import { Profile } from "@/types/profile";

interface ProfileHeaderProps {
  profile: Profile;
  isProfileEmpty: boolean;
}

export const ProfileHeader = ({ profile, isProfileEmpty }: ProfileHeaderProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-start gap-6 mb-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profile.avatar_url ?? undefined} alt={profile.username} />
          <AvatarFallback>
            {profile.username?.substring(0, 2).toUpperCase() ?? "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl font-bold">{profile.username}</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  {isProfileEmpty ? "Update Profile" : "Edit Profile"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{isProfileEmpty ? "Complete Your Profile" : "Edit Profile"}</DialogTitle>
                </DialogHeader>
                <ProfileEditForm 
                  initialData={profile}
                  userId={profile.user_id}
                />
              </DialogContent>
            </Dialog>
          </div>
          
          {profile.bio && (
            <p className="text-muted-foreground max-w-md mb-4">{profile.bio}</p>
          )}
          
          <div className="space-y-2 mb-4">
            {profile.location && (
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.contact_email && (
              <div className="flex items-center text-muted-foreground">
                <Mail className="h-4 w-4 mr-2" />
                <a href={`mailto:${profile.contact_email}`} className="hover:text-primary">
                  {profile.contact_email}
                </a>
              </div>
            )}
            {profile.phone_number && (
              <div className="flex items-center text-muted-foreground">
                <Phone className="h-4 w-4 mr-2" />
                <span>{profile.phone_number}</span>
              </div>
            )}
          </div>

          {profile.interests && profile.interests.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <Heart className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium">Interests</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, index) => (
                  <Badge key={index} variant="secondary">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {profile.community_intent && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Community Goals</h3>
              <p className="text-muted-foreground">{profile.community_intent}</p>
            </div>
          )}

          {isProfileEmpty && (
            <div className="bg-muted/50 p-4 rounded-lg mt-4">
              <p className="text-muted-foreground">
                Your profile is empty. Click "Update Profile" to add more information about yourself.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};