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

      {categories?.subcategories?.map((category) => (
        <TabsContent key={category.id} value={category.id} className="mt-6">
          <CulturePostGrid 
            posts={posts?.filter((post) => post.subcategory_id === category.id)} 
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};