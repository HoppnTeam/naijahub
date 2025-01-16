import { useState } from "react";
import { Trophy, Medal, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "@/components/PostCard";
import { LiveScoresWidget } from "./LiveScoresWidget";
import { FanZone } from "./FanZone";
import { SportsSubcategoryFilter } from "./SportsSubcategoryFilter";
import { Post } from "@/types/post";

interface SportsContentProps {
  posts: Post[] | undefined;
  subcategories: any[] | undefined;
  selectedSubcategory: string | null;
  onSubcategoryChange: (subcategoryId: string | null) => void;
}

export const SportsContent = ({ 
  posts, 
  subcategories,
  selectedSubcategory,
  onSubcategoryChange,
}: SportsContentProps) => {
  const [selectedTab, setSelectedTab] = useState("latest");

  return (
    <div className="lg:col-span-3">
      <LiveScoresWidget />
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-8">
        <TabsList className="w-full justify-start mb-6">
          <TabsTrigger value="latest">
            <Trophy className="w-4 h-4 mr-2" />
            Latest
          </TabsTrigger>
          <TabsTrigger value="trending">
            <Medal className="w-4 h-4 mr-2" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="fan-zone">
            <Users className="w-4 h-4 mr-2" />
            Fan Zone
          </TabsTrigger>
        </TabsList>

        <SportsSubcategoryFilter
          subcategories={subcategories}
          selectedSubcategory={selectedSubcategory}
          onSubcategoryChange={onSubcategoryChange}
        />

        <TabsContent value="latest" className="space-y-6">
          {posts?.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          {posts?.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No posts found. Be the first to create a post in this category!
            </div>
          )}
        </TabsContent>

        <TabsContent value="trending" className="space-y-6">
          {posts?.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          {posts?.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No trending posts yet.
            </div>
          )}
        </TabsContent>

        <TabsContent value="fan-zone">
          <FanZone />
        </TabsContent>
      </Tabs>
    </div>
  );
};