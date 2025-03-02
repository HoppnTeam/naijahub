import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "./PostCard";
import { Post } from "@/types/post";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon?: string;
}

interface CategoryTabsProps {
  categories?: Category[];
  posts?: Post[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryTabs = ({
  categories,
  posts,
  selectedCategory,
  onCategoryChange,
}: CategoryTabsProps) => {
  const getCategoryIcon = (category: Category) => {
    if (!category.icon) return null;
    
    // Convert icon name to Pascal case for Lucide icon component name
    const iconName = category.icon
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('') as keyof typeof Icons;
    
    const IconComponent = Icons[iconName] as LucideIcon;
    
    return IconComponent ? <IconComponent className="w-5 h-5 text-[#E2725B]" /> : null;
  };

  const handleCategoryClick = (categoryId: string) => {
    onCategoryChange(categoryId);
  };

  return (
    <Tabs defaultValue={selectedCategory} className="w-full">
      <ScrollArea className="w-full relative" type="scroll">
        <div className="overflow-x-auto">
          <TabsList className="w-max inline-flex mb-4 md:mb-6 p-1 bg-[#243949] rounded-lg shadow-md">
            <TabsTrigger 
              value="all" 
              onClick={() => onCategoryChange("all")}
              className="text-white hover:bg-[#32a852]/20 transition-colors text-sm md:text-base font-medium px-2 md:px-4"
            >
              All Posts
            </TabsTrigger>
            {categories?.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="whitespace-nowrap flex items-center gap-1.5 md:gap-2.5 transition-colors text-white hover:bg-[#32a852]/20 text-sm md:text-base font-medium px-2 md:px-4"
              >
                {getCategoryIcon(category)}
                <span className="hidden md:inline">{category.name}</span>
                <span className="md:hidden">
                  {category.name.split(' ')[0]}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <ScrollBar orientation="horizontal" className="bg-[#32a852]/10" />
      </ScrollArea>

      <TabsContent value={selectedCategory} className="mt-4 md:mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {posts?.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default CategoryTabs;
