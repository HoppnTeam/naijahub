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
      <TabsTrigger value="cultural-highlights">Cultural Highlights</TabsTrigger>
      <TabsTrigger value="personal-ads">Personal Ads</TabsTrigger>
      <TabsTrigger value="festivals">Festivals</TabsTrigger>
      <TabsTrigger value="languages">Languages</TabsTrigger>
      <TabsTrigger value="history">History</TabsTrigger>
      <TabsTrigger value="fashion">Fashion</TabsTrigger>
    </TabsList>
  );
};