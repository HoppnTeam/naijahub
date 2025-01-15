import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { CelebrityFollowForm } from "./CelebrityFollowForm";
import { CelebrityPosts } from "./CelebrityPosts";
import { CelebrityFollowsList } from "./CelebrityFollowsList";

export const CelebrityCorner = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Celebrity Corner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <CelebrityFollowForm onFollow={() => {
              // Trigger a refetch of the follows list
              window.location.reload();
            }} />
            <CelebrityPosts />
            <CelebrityFollowsList />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};