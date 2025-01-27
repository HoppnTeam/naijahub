import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Calendar, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreatePersonalAd } from "./personal-ads/CreatePersonalAd";

interface CultureSidebarProps {
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
}

export const CultureSidebar = ({ isCreateDialogOpen, setIsCreateDialogOpen }: CultureSidebarProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Personal Ads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            className="w-full" 
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Users className="mr-2 h-4 w-4" />
            Create Personal Ad
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create a Personal Ad</DialogTitle>
          </DialogHeader>
          <CreatePersonalAd />
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Upcoming Festivals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>New Yam Festival</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Durbar Festival</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Eyo Festival</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};