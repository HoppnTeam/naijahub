import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PostCard } from "@/components/PostCard";
import { Post } from "@/types/post";
import { Button } from "@/components/ui/button";
import { Car, Settings, ShoppingBag, Newspaper, Wrench, Shield, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkshopsList } from "@/components/workshops/WorkshopsList";

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
        return <Car className="w-5 h-5" />;
      case "Maintenance & Repairs":
        return <Settings className="w-5 h-5" />;
      case "Auto Marketplace":
        return <ShoppingBag className="w-5 h-5" />;
      case "Auto News":
        return <Newspaper className="w-5 h-5" />;
      case "Workshops & Services":
        return <Wrench className="w-5 h-5" />;
      case "Road Safety":
        return <Shield className="w-5 h-5" />;
      default:
        return <Car className="w-5 h-5" />;
    }
  };

  const getSubcategoryDescription = (name: string) => {
    switch (name) {
      case "Car Reviews":
        return "Detailed reviews and comparisons of vehicles available in Nigeria";
      case "Maintenance & Repairs":
        return "Expert tips, guides, and discussions about car maintenance and repairs";
      case "Auto Marketplace":
        return "Buy, sell, and trade vehicles, parts, and automotive accessories";
      case "Auto News":
        return "Latest automotive news and updates from Nigeria and worldwide";
      case "Workshops & Services":
        return "Find and review trusted local automotive workshops and services";
      case "Road Safety":
        return "Discussions and tips about road safety in Nigeria";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Subcategories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Button
          variant={selectedSubcategory === null ? "default" : "outline"}
          onClick={() => onSubcategoryChange(null)}
          className={`flex items-center gap-2 h-auto p-4 w-full justify-start ${
            selectedSubcategory === null ? 'bg-primary hover:bg-primary/90' : ''
          }`}
        >
          <Car className="h-5 w-5 flex-shrink-0" />
          <div className="text-left">
            <div className="font-semibold">All Automotive</div>
            <div className="text-sm text-muted-foreground">View all posts</div>
          </div>
        </Button>
        {subcategories?.map((subcategory) => (
          <Button
            key={subcategory.id}
            variant={selectedSubcategory === subcategory.id ? "default" : "outline"}
            onClick={() => onSubcategoryChange(subcategory.id)}
            className={`flex items-center gap-2 h-auto p-4 w-full justify-start ${
              selectedSubcategory === subcategory.id ? 'bg-primary hover:bg-primary/90' : ''
            }`}
          >
            <div className="flex-shrink-0">
              {getSubcategoryIcon(subcategory.name)}
            </div>
            <div className="text-left flex-1 min-w-0">
              <div className="font-semibold truncate">{subcategory.name}</div>
              <div className="text-sm text-muted-foreground line-clamp-2">
                {getSubcategoryDescription(subcategory.name)}
              </div>
            </div>
          </Button>
        ))}
      </div>

      {/* Selected Subcategory Header */}
      {selectedSubcategory && subcategories?.find(s => s.id === selectedSubcategory) && (
        <Card className="border-l-4 border-l-primary bg-muted/30">
          <CardHeader>
            <div className="flex items-center gap-3">
              {getSubcategoryIcon(subcategories.find(s => s.id === selectedSubcategory)?.name || "")}
              <div>
                <CardTitle>{subcategories.find(s => s.id === selectedSubcategory)?.name}</CardTitle>
                <CardDescription>
                  {getSubcategoryDescription(subcategories.find(s => s.id === selectedSubcategory)?.name || "")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Content Area */}
      {selectedSubcategory && 
       subcategories?.find(s => s.id === selectedSubcategory)?.name === "Workshops & Services" ? (
        <WorkshopsList />
      ) : (
        /* Posts Grid */
        <div className="space-y-4">
          {posts?.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <AlertTriangle className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-lg font-semibold text-center">No posts found</p>
                <p className="text-muted-foreground text-center">
                  {searchQuery 
                    ? "Try adjusting your search terms"
                    : "Be the first to create a post in this category"}
                </p>
              </CardContent>
            </Card>
          ) : (
            posts?.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
      )}
    </div>
  );
};
