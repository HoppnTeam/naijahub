import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "./PostCard";

interface Category {
  id: string;
  name: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  image_url?: string | null;
  created_at: string;
  user_id: string;
  category_id: string | null;
  profiles: {
    username: string;
    avatar_url?: string | null;
  } | null;
  categories: {
    name: string;
  } | null;
  _count?: {
    comments: number;
    likes: number;
  };
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
  // Filter to show only main categories
  const mainCategories = categories?.filter(category => 
    ["News & Politics", "Entertainment", "Technology", "Sports", 
     "Business", "Health", "Agriculture", "Travel", 
     "Culture", "Automotive"].includes(category.name)
  );

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
            onClick={() => onCategoryChange(category.id)}
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