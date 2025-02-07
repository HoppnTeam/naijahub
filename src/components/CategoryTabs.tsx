
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "./PostCard";
import { useNavigate } from "react-router-dom";
import { Post } from "@/types/post";
import { ScrollArea } from "./ui/scroll-area";
import { 
  Newspaper, 
  Music, 
  Laptop, 
  Trophy, 
  Briefcase, 
  Heart, 
  Wheat, 
  Plane, 
  Users, 
  Car 
} from "lucide-react";

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

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName) {
      case "News & Politics":
        return <Newspaper className="w-4 h-4" />;
      case "Entertainment":
        return <Music className="w-4 h-4" />;
      case "Technology":
        return <Laptop className="w-4 h-4" />;
      case "Sports":
        return <Trophy className="w-4 h-4" />;
      case "Business":
        return <Briefcase className="w-4 h-4" />;
      case "Health":
        return <Heart className="w-4 h-4" />;
      case "Agriculture":
        return <Wheat className="w-4 h-4" />;
      case "Travel":
        return <Plane className="w-4 h-4" />;
      case "Culture & Personals":
        return <Users className="w-4 h-4" />;
      case "Automotive":
        return <Car className="w-4 h-4" />;
      default:
        return null;
    }
  };

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

  const getCategoryStyle = (categoryName: string) => {
    const styles: { [key: string]: string } = {
      "News & Politics": "hover:bg-[#32a852]/20 hover:text-white",
      "Entertainment": "hover:bg-[#E2725B]/20 hover:text-white",
      "Technology": "hover:bg-[#32a852]/20 hover:text-white",
      "Sports": "hover:bg-[#E2725B]/20 hover:text-white",
      "Business": "hover:bg-[#32a852]/20 hover:text-white",
      "Health": "hover:bg-[#E2725B]/20 hover:text-white",
      "Agriculture": "hover:bg-[#32a852]/20 hover:text-white",
      "Travel": "hover:bg-[#E2725B]/20 hover:text-white",
      "Culture & Personals": "hover:bg-[#32a852]/20 hover:text-white",
      "Automotive": "hover:bg-[#E2725B]/20 hover:text-white"
    };
    return styles[categoryName] || "";
  };

  return (
    <Tabs defaultValue="all" className="w-full">
      <ScrollArea className="w-full">
        <TabsList className="w-full flex-nowrap mb-6 p-1 bg-[#221F26] rounded-lg shadow-md">
          <TabsTrigger 
            value="all" 
            onClick={() => onCategoryChange("all")}
            className="text-white hover:bg-[#32a852]/20 transition-colors"
          >
            All Posts
          </TabsTrigger>
          {mainCategories?.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              onClick={() => handleCategoryClick(category.id, category.name)}
              className={`whitespace-nowrap flex items-center gap-2 transition-colors text-white ${getCategoryStyle(category.name)}`}
            >
              {getCategoryIcon(category.name)}
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </ScrollArea>

      <TabsContent value={selectedCategory} className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {posts?.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};
