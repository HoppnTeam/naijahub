import { SubcategoriesGrid } from "./SubcategoriesGrid";
import { MarketplaceContent } from "./MarketplaceContent";
import { RegularContent } from "./RegularContent";

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
  return (
    <div className="space-y-6">
      <SubcategoriesGrid 
        subcategories={subcategories}
        selectedSubcategory={selectedSubcategory}
        onSubcategoryChange={onSubcategoryChange}
      />

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