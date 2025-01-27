import { SubcategoriesGrid } from "./SubcategoriesGrid";
import { MarketplaceContent } from "./MarketplaceContent";
import { RegularContent } from "./RegularContent";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface AutomotiveContentProps {
  subcategories?: Category[];
  selectedSubcategory: string | null;
  onSubcategoryChange: (subcategoryId: string | null) => void;
  searchQuery: string;
}

export const AutomotiveContent = ({ 
  subcategories,
  selectedSubcategory,
  onSubcategoryChange,
  searchQuery 
}: AutomotiveContentProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <SubcategoriesGrid 
          subcategories={subcategories}
          selectedSubcategory={selectedSubcategory}
          onSubcategoryChange={onSubcategoryChange}
        />
        <Button 
          onClick={() => navigate("/create-post", { 
            state: { 
              category: "Automotive",
              categoryId: subcategories?.[0]?.id 
            }
          })}
          className="ml-4"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Post
        </Button>
      </div>

      {selectedSubcategory === "marketplace" ? (
        <MarketplaceContent searchQuery={searchQuery} />
      ) : (
        <RegularContent 
          subcategories={subcategories}
          selectedSubcategory={selectedSubcategory}
          searchQuery={searchQuery}
        />
      )}
    </div>
  );
};