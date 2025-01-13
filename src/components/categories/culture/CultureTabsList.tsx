import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Category {
  id: string;
  name: string;
}

interface CultureTabsListProps {
  subcategories: Category[] | undefined;
}

export const CultureTabsList = ({ subcategories }: CultureTabsListProps) => {
  return (
    <TabsList className="w-full overflow-x-auto flex space-x-2 mb-6">
      <TabsTrigger value="all">All Posts</TabsTrigger>
      {subcategories?.map((category) => (
        <TabsTrigger key={category.id} value={category.id}>
          {category.name}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};