// ⚠️ WARNING: This file contains critical user profile functionality.
// DO NOT MODIFY without explicit user request and thorough testing.
// Last restored: [Current Date]

import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { ProfilePosts } from "@/components/profile/ProfilePosts";
import { OrdersList } from "@/components/marketplace/OrdersList";
import { AchievementsTab } from "@/components/profile/AchievementsTab";
import { LeaderboardTab } from "@/components/profile/LeaderboardTab";
import { useProfile } from "@/hooks/useProfile";
import type { Post } from "@/types/post";

const Profile = () => {
  const { id } = useParams();
  console.log("Profile ID from route:", id);

  const { data: profile, isLoading, error } = useProfile(id);

  if (error) {
    console.error("Query error:", error);
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error loading profile</h2>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

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

  const isProfileEmpty = !profile.bio && !profile.location && !profile.interests?.length && !profile.community_intent;

  // Transform posts to include required fields from Post type
  const postsWithRequiredFields: Post[] = profile.posts?.map(post => ({
    ...post,
    user_id: profile.user_id,
    category_id: post.category_id || '',
    subcategory_id: post.subcategory_id || null,
    pinned: post.pinned || false,
    is_live: post.is_live || false,
    is_draft: post.is_draft || false,
  })) || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <ProfileHeader profile={profile} isProfileEmpty={isProfileEmpty} />
        <ProfileStats profile={profile} />

        <Tabs defaultValue="posts" className="space-y-6 mt-8">
          <TabsList>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            <ProfilePosts posts={postsWithRequiredFields} />
          </TabsContent>

          <TabsContent value="achievements">
            <AchievementsTab userId={profile.user_id} />
          </TabsContent>

          <TabsContent value="leaderboard">
            <LeaderboardTab />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersList />
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