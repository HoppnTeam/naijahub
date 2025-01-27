import { Tabs, TabsContent } from "@/components/ui/tabs";
import { CultureTabsList } from "./CultureTabsList";
import { CulturePostGrid } from "./CulturePostGrid";
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

  return (
    <Tabs defaultValue="all" className="w-full">
      <CultureTabsList subcategories={categories?.subcategories} />

      <TabsContent value="all" className="mt-6">
        <CulturePostGrid posts={posts} />
      </TabsContent>

      {["cultural-highlights", "personal-ads", "festivals", "languages", "history", "fashion"].map((tab) => (
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