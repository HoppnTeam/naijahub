import { TopContributors } from "./TopContributors";
import { SubcategoriesList } from "./SubcategoriesList";

interface EntertainmentSidebarProps {
  subcategories?: { id: string; name: string }[];
  selectedSubcategoryId?: string;
  onSubcategorySelect: (id: string) => void;
}

export const EntertainmentSidebar = ({
  subcategories,
  selectedSubcategoryId,
  onSubcategorySelect,
}: EntertainmentSidebarProps) => {
  return (
    <div className="space-y-6">
      <TopContributors />
      <SubcategoriesList
        subcategories={subcategories}
        selectedSubcategoryId={selectedSubcategoryId}
        onSubcategorySelect={onSubcategorySelect}
      />
    </div>
  );
};