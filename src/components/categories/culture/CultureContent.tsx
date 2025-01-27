import { Tabs, TabsContent } from "@/components/ui/tabs";
import { CultureTabsList } from "./CultureTabsList";
import { CulturePostGrid } from "./CulturePostGrid";
import { PersonalAdsGrid } from "./personal-ads/PersonalAdsGrid";
import { CreatePersonalAd } from "./personal-ads/CreatePersonalAd";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCulturePosts } from "@/hooks/use-culture-posts";

interface Category {
  id: string;
  name: string;
}

interface CultureContentProps {
  categories: {
    mainCategory: Category;
    subcategories: Category[];
  } | undefined;
}

export const CultureContent = ({ categories }: CultureContentProps) => {
  const { data: posts } = useCulturePosts(categories?.mainCategory);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const personalAdsSubcategory = categories?.subcategories.find(
    (cat) => cat.name === "Relationships & Dating"
  );

  const personalAds = posts?.filter(
    (post) => post.subcategory_id === personalAdsSubcategory?.id
  );

  return (
    <Tabs defaultValue="all" className="w-full">
      <div className="flex items-center justify-between mb-6">
        <CultureTabsList subcategories={categories?.subcategories} />
        <Button onClick={() => setIsCreateDialogOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Create Personal Ad
        </Button>
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create a Personal Ad</DialogTitle>
          </DialogHeader>
          <CreatePersonalAd />
        </DialogContent>
      </Dialog>

      <TabsContent value="all" className="mt-6">
        <CulturePostGrid posts={posts} />
      </TabsContent>

      <TabsContent value="relationships-dating" className="mt-6">
        <PersonalAdsGrid posts={personalAds} />
      </TabsContent>

      {["cultural-highlights", "modern-culture", "language-exchange", "friendship", "professional-networking", "events-meetups", "arts-fashion"].map((tab) => (
        <TabsContent key={tab} value={tab} className="mt-6">
          <CulturePostGrid 
            posts={posts?.filter((post) => {
              const subcategory = categories?.subcategories.find(
                (cat) => cat.name.toLowerCase().replace(/\s+/g, '-') === tab
              );
              return post.subcategory_id === subcategory?.id;
            })} 
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};