import { Book, Users, Crown, Languages } from "lucide-react";

export const CultureHeader = () => {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center gap-2">
        <Crown className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Culture & Personals</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex items-center gap-2 p-4 bg-card rounded-lg shadow">
          <Book className="h-5 w-5 text-primary" />
          <span>Cultural Highlights</span>
        </div>
        <div className="flex items-center gap-2 p-4 bg-card rounded-lg shadow">
          <Users className="h-5 w-5 text-primary" />
          <span>Personal Ads</span>
        </div>
        <div className="flex items-center gap-2 p-4 bg-card rounded-lg shadow">
          <Languages className="h-5 w-5 text-primary" />
          <span>Languages</span>
        </div>
        <div className="flex items-center gap-2 p-4 bg-card rounded-lg shadow">
          <Crown className="h-5 w-5 text-primary" />
          <span>Festivals</span>
        </div>
      </div>
    </div>
  );
};