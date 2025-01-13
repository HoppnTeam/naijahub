import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "./PostCard";
import { useNavigate } from "react-router-dom";
import { Post } from "@/types/post";

interface Category {
  id: string;
  name: string;
}

interface CategoryTabsProps {
  categories?: Category[];
  posts?: Post[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryTabs = ({
  categories,
  posts,
  selectedCategory,
  onCategoryChange,
}: CategoryTabsProps) => {
  const navigate = useNavigate();

  const mainCategories = categories?.filter(category => 
    ["News & Politics", "Entertainment", "Technology", "Sports", 
     "Business", "Health", "Agriculture", "Travel", 
     "Culture & Personals", "Automotive"].includes(category.name)
  );

  const getCategoryPath = (categoryName: string) => {
    const paths: { [key: string]: string } = {
      "News & Politics": "/categories/news-politics",
      "Entertainment": "/categories/entertainment",
      "Technology": "/categories/technology",
      "Sports": "/categories/sports",
      "Business": "/categories/business",
      "Health": "/categories/health",
      "Agriculture": "/categories/agriculture",
      "Travel": "/categories/travel",
      "Culture & Personals": "/categories/culture",
      "Automotive": "/categories/automotive"
    };
    return paths[categoryName] || "/";
  };

  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    onCategoryChange(categoryId);
    const path = getCategoryPath(categoryName);
    navigate(path);
  };

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="w-full overflow-x-auto flex space-x-2 mb-6">
        <TabsTrigger value="all" onClick={() => onCategoryChange("all")}>
          All Posts
        </TabsTrigger>
        {mainCategories?.map((category) => (
          <TabsTrigger
            key={category.id}
            value={category.id}
            onClick={() => handleCategoryClick(category.id, category.name)}
          >
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value={selectedCategory} className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts?.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};