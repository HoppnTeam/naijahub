import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SportsSidebarProps {
  subcategories?: {
    id: string;
    name: string;
  }[];
}

export const SportsSidebar = ({ subcategories }: SportsSidebarProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Fan Zones
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          <Button variant="ghost" className="w-full justify-start">
            Premier League
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            NPFL
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Champions League
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5" />
            Fantasy League
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Join our community-driven fantasy leagues!
          </p>
          <Button className="w-full">Join Fantasy League</Button>
        </CardContent>
      </Card>

      {subcategories && subcategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Sports Communities
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {subcategories.map((subcategory) => (
              <Button
                key={subcategory.id}
                variant="ghost"
                className="w-full justify-start"
              >
                {subcategory.name}
              </Button>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};