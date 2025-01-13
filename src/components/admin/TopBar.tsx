import { UserMenu } from "@/components/UserMenu";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const TopBar = () => {
  return (
    <div className="h-16 border-b bg-white">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center flex-1 px-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="w-full pl-8"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <UserMenu />
        </div>
      </div>
    </div>
  );
};