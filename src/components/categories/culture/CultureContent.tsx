import { Tabs, TabsContent } from "@/components/ui/tabs";
import { CultureTabsList } from "./CultureTabsList";
import { CulturePostGrid } from "./CulturePostGrid";
import { PersonalAdsGrid } from "./personal-ads/PersonalAdsGrid";
import { useCulturePosts } from "@/hooks/use-culture-posts";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const personalAdsSubcategory = categories?.subcategories.find(
    (cat) => cat.name === "Relationships & Dating"
  );

  const personalAds = posts?.filter(
    (post) => post.subcategory_id === personalAdsSubcategory?.id
  );

  const handleCreatePost = () => {
    navigate("/create-post", {
      state: {
        category: "Culture & Personals",
        categoryId: categories?.mainCategory.id,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Culture Posts</h2>
        <Button onClick={handleCreatePost} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Culture Post
        </Button>
      </div>

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
    </div>
  );
};