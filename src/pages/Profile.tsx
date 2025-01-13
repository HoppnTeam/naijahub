import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, ThumbsUp, Calendar, ScrollText, Mail, Phone, MapPin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  const { id } = useParams();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", id],
    queryFn: async () => {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select(`
          *,
          posts (
            *,
            categories (name),
            likes (user_id),
            comments (id)
          )
        `)
        .eq("user_id", id)
        .single();

      if (profileError) {
        console.error("Profile error:", profileError);
        throw profileError;
      }
      
      console.log("Profile data:", profileData);
      return profileData;
    },
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center gap-6 mb-8">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Profile not found</h2>
          <p className="text-muted-foreground">The requested profile could not be found.</p>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-start gap-6 mb-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.avatar_url ?? undefined} alt={profile.username} />
              <AvatarFallback>
                {profile.username?.substring(0, 2).toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{profile.username}</h1>
              {profile.bio && (
                <p className="text-muted-foreground max-w-md mb-4">{profile.bio}</p>
              )}
              
              {/* Contact Information */}
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

              {/* Interests */}
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

              {/* Community Intent */}
              {profile.community_intent && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Community Goals</h3>
                  <p className="text-muted-foreground">{profile.community_intent}</p>
                </div>
              )}
            </div>
          </div>

          {/* Stats Grid */}
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
        </div>

        {/* Posts Section */}
        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-6">
            {profile.posts?.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No posts yet</p>
                </CardContent>
              </Card>
            ) : (
              profile.posts?.map((post) => (
                <Card key={post.id} className="hover:bg-muted/50 transition-colors">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold hover:text-primary">
                        <a href={`/posts/${post.id}`}>{post.title}</a>
                      </h3>
                      {post.categories?.name && (
                        <Badge variant="secondary">
                          {post.categories.name}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {post.content.substring(0, 200)}
                      {post.content.length > 200 ? "..." : ""}
                    </p>
                    <div className="flex gap-4">
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="mr-2 h-4 w-4" />
                        {post.likes?.length ?? 0}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        {post.comments?.length ?? 0}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Recent activity will be shown here...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;