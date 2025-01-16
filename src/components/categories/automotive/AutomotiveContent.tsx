import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PostCard } from "@/components/PostCard";
import { Post } from "@/types/post";
import { Button } from "@/components/ui/button";
import { Car, Settings, ShoppingBag, Newspaper, Wrench, Shield } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface AutomotiveContentProps {
  posts?: any[];
  subcategories?: Category[];
  selectedSubcategory: string | null;
  onSubcategoryChange: (subcategoryId: string | null) => void;
  searchQuery: string;
}

export const AutomotiveContent = ({ 
  posts,
  subcategories,
  selectedSubcategory,
  onSubcategoryChange,
  searchQuery 
}: AutomotiveContentProps) => {
  const getSubcategoryIcon = (name: string) => {
    switch (name) {
      case "Car Reviews":
        return <Car className="w-4 h-4 mr-2" />;
      case "Maintenance & Repairs":
        return <Settings className="w-4 h-4 mr-2" />;
      case "Buy & Sell":
        return <ShoppingBag className="w-4 h-4 mr-2" />;
      case "Auto News":
        return <Newspaper className="w-4 h-4 mr-2" />;
      case "Workshops & Services":
        return <Wrench className="w-4 h-4 mr-2" />;
      case "Road Safety":
        return <Shield className="w-4 h-4 mr-2" />;
      default:
        return <Car className="w-4 h-4 mr-2" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={selectedSubcategory === null ? "default" : "outline"}
          onClick={() => onSubcategoryChange(null)}
          className="flex items-center"
        >
          <Car className="w-4 h-4 mr-2" />
          All Automotive
        </Button>
        {subcategories?.map((subcategory) => (
          <Button
            key={subcategory.id}
            variant={selectedSubcategory === subcategory.id ? "default" : "outline"}
            onClick={() => onSubcategoryChange(subcategory.id)}
            className="flex items-center"
          >
            {getSubcategoryIcon(subcategory.name)}
            {subcategory.name}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {posts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        {posts?.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No posts found in this category.
          </div>
        )}
      </div>
    </div>
  );
};