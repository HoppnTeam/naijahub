import { Book, Users, Languages, Crown } from "lucide-react";
import { Card } from "@/components/ui/card";

export const CultureHeader = () => {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center gap-2">
        <Crown className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Culture & Personals</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-2 p-4 hover:bg-accent cursor-pointer transition-colors">
          <Book className="h-5 w-5 text-primary" />
          <span>Cultural Highlights</span>
        </Card>
        <Card className="flex items-center gap-2 p-4 hover:bg-accent cursor-pointer transition-colors">
          <Users className="h-5 w-5 text-primary" />
          <span>Personal Ads</span>
        </Card>
        <Card className="flex items-center gap-2 p-4 hover:bg-accent cursor-pointer transition-colors">
          <Languages className="h-5 w-5 text-primary" />
          <span>Languages</span>
        </Card>
        <Card className="flex items-center gap-2 p-4 hover:bg-accent cursor-pointer transition-colors">
          <Crown className="h-5 w-5 text-primary" />
          <span>Festivals</span>
        </Card>
      </div>
    </div>
  );
};