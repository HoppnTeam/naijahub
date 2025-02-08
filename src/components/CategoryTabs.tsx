
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "./PostCard";
import { useNavigate } from "react-router-dom";
import { Post } from "@/types/post";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { 
  Newspaper, 
  Music2, 
  Laptop, 
  Trophy, 
  Briefcase, 
  Heart, 
  Wheat, 
  Plane, 
  Users, 
  Car,
  Scissors
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

const CategoryTabs = ({
  categories,
  posts,
  selectedCategory,
  onCategoryChange,
}: CategoryTabsProps) => {
  const navigate = useNavigate();

  console.log("Raw categories received:", categories);

  const categoryNames = [
    "News & Politics",
    "Entertainment",
    "Technology",
    "Sports",
    "Business",
    "Health",
    "Agriculture",
    "Travel",
    "Culture & Personals",
    "Automotive",
    "Fashion & Beauty"
  ];

  console.log("Expected category names:", categoryNames);

  // Add debug logging for each category
  categories?.forEach(cat => {
    console.log(`Category in raw data - ID: ${cat.id}, Name: "${cat.name}"`, {
      rawName: cat.name,
      trimmedName: cat.name.trim(),
      length: cat.name.length,
      charCodes: Array.from(cat.name).map(c => c.charCodeAt(0))
    });
  });

  const mainCategories = categories?.filter(category => {
    const trimmedName = category.name.trim();
    const isMainCategory = categoryNames.includes(trimmedName);
    console.log(`Checking category "${trimmedName}" (${category.id}):`, {
      trimmedName,
      isMainCategory,
      exactMatch: categoryNames.find(name => name === trimmedName),
      possibleMatches: categoryNames.filter(name => name.includes(trimmedName) || trimmedName.includes(name))
    });
    return isMainCategory;
  });

  console.log("Filtered main categories:", mainCategories?.map(c => ({id: c.id, name: c.name})));

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName) {
      case "News & Politics":
        return <Newspaper className="w-5 h-5 text-[#E2725B]" />;
      case "Entertainment":
        return <Music2 className="w-5 h-5 text-[#E2725B]" />;
      case "Technology":
        return <Laptop className="w-5 h-5 text-[#E2725B]" />;
      case "Sports":
        return <Trophy className="w-5 h-5 text-[#E2725B]" />;
      case "Business":
        return <Briefcase className="w-5 h-5 text-[#E2725B]" />;
      case "Health":
        return <Heart className="w-5 h-5 text-[#E2725B]" />;
      case "Agriculture":
        return <Wheat className="w-5 h-5 text-[#E2725B]" />;
      case "Travel":
        return <Plane className="w-5 h-5 text-[#E2725B]" />;
      case "Culture & Personals":
        return <Users className="w-5 h-5 text-[#E2725B]" />;
      case "Automotive":
        return <Car className="w-5 h-5 text-[#E2725B]" />;
      case "Fashion & Beauty":
        return <Scissors className="w-5 h-5 text-[#E2725B]" />;
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
      "Automotive": "/categories/automotive",
      "Fashion & Beauty": "/categories/fashion-beauty"
    };
    return paths[categoryName] || "/";
  };

  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    console.log("Category clicked:", categoryName, "with ID:", categoryId);
    onCategoryChange(categoryId);
    const path = getCategoryPath(categoryName);
    navigate(path);
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
            {mainCategories?.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                onClick={() => handleCategoryClick(category.id, category.name)}
                className="whitespace-nowrap flex items-center gap-1.5 md:gap-2.5 transition-colors text-white hover:bg-[#32a852]/20 text-sm md:text-base font-medium px-2 md:px-4"
              >
                {getCategoryIcon(category.name)}
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
