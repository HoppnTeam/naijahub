import { Car } from "lucide-react";
import { SubcategoryButton } from "./SubcategoryButton";
import { getSubcategoryIcon, getSubcategoryDescription } from "./utils";

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface SubcategoriesGridProps {
  subcategories?: Category[];
  selectedSubcategory: string | null;
  onSubcategoryChange: (subcategoryId: string | null) => void;
}

export const SubcategoriesGrid = ({
  subcategories,
  selectedSubcategory,
  onSubcategoryChange,
}: SubcategoriesGridProps) => {
  // Filter out any subcategory that has "Auto Marketplace" as its name
  const filteredSubcategories = subcategories?.filter(
    (subcategory) => subcategory.name.toLowerCase() !== "auto marketplace"
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <SubcategoryButton
        id={null}
        name="All Automotive"
        description="View all listings"
        icon={<Car className="h-5 w-5 flex-shrink-0" />}
        isSelected={selectedSubcategory === null}
        onClick={() => onSubcategoryChange(null)}
      />
      
      {filteredSubcategories?.map((subcategory) => (
        <SubcategoryButton
          key={subcategory.id}
          id={subcategory.id}
          name={subcategory.name}
          description={getSubcategoryDescription(subcategory.name)}
          icon={getSubcategoryIcon(subcategory.name)}
          isSelected={selectedSubcategory === subcategory.id}
          onClick={() => onSubcategoryChange(subcategory.id)}
        />
      ))}

      <SubcategoryButton
        id="marketplace"
        name="Auto Marketplace"
        description="Buy and sell vehicles and parts"
        icon={<Car className="h-5 w-5 flex-shrink-0" />}
        isSelected={selectedSubcategory === "marketplace"}
        onClick={() => onSubcategoryChange("marketplace")}
      />
    </div>
  );
};