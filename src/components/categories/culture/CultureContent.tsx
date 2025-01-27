import { Tabs, TabsContent } from "@/components/ui/tabs";
import { CultureTabsList } from "./CultureTabsList";
import { CulturePostGrid } from "./CulturePostGrid";
import { PersonalAdsGrid } from "./personal-ads/PersonalAdsGrid";
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
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
}

export const CultureContent = ({ 
  categories,
  isCreateDialogOpen,
  setIsCreateDialogOpen 
}: CultureContentProps) => {
  const { data: posts } = useCulturePosts(categories?.mainCategory);

  const personalAdsSubcategory = categories?.subcategories.find(
    (cat) => cat.name === "Relationships & Dating"
  );

  const personalAds = posts?.filter(
    (post) => post.subcategory_id === personalAdsSubcategory?.id
  );

  return (
    <Tabs defaultValue="all" className="w-full">
      <CultureTabsList subcategories={categories?.subcategories} />

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