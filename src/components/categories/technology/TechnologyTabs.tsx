import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "@/components/PostCard";
import { TechJobsList } from "@/components/jobs/TechJobsList";
import { MarketplaceListings } from "@/components/marketplace/MarketplaceListings";
import { Laptop, Code, Cpu, Package } from "lucide-react";
import { Post } from "@/types/post";

interface TechnologyTabsProps {
  posts: Post[] | undefined;
  selectedTab: string;
  onTabChange: (value: string) => void;
}

export const TechnologyTabs = ({ posts, selectedTab, onTabChange }: TechnologyTabsProps) => {
  return (
    <Tabs value={selectedTab} onValueChange={onTabChange}>
      <TabsList className="w-full justify-start mb-6">
        <TabsTrigger value="latest">
          <Laptop className="w-4 h-4 mr-2" />
          Latest
        </TabsTrigger>
        <TabsTrigger value="trending">
          <Code className="w-4 h-4 mr-2" />
          Trending
        </TabsTrigger>
        <TabsTrigger value="tech-jobs">
          <Cpu className="w-4 h-4 mr-2" />
          Tech Jobs
        </TabsTrigger>
        <TabsTrigger value="tech-marketplace">
          <Package className="w-4 h-4 mr-2" />
          Marketplace
        </TabsTrigger>
      </TabsList>

      <TabsContent value="latest" className="space-y-6">
        {posts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        {posts?.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No posts found
          </div>
        )}
      </TabsContent>

      <TabsContent value="trending" className="space-y-6">
        {posts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        {posts?.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No trending posts
          </div>
        )}
      </TabsContent>

      <TabsContent value="tech-jobs">
        <TechJobsList />
      </TabsContent>

      <TabsContent value="tech-marketplace">
        <MarketplaceListings />
      </TabsContent>
    </Tabs>
  );
};