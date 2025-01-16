import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AddWorkshopForm } from "./AddWorkshopForm";
import WorkshopDetails from "./WorkshopDetails";
import { Workshop } from "@/types/workshop";

interface WorkshopsListProps {
  workshops: Workshop[];
}

export const WorkshopsList = ({ workshops }: WorkshopsListProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Automotive Workshops</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Workshop</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Workshop</DialogTitle>
            </DialogHeader>
            <AddWorkshopForm onSuccess={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {workshops.map((workshop) => (
          <Card key={workshop.id} className="p-6">
            <WorkshopDetails workshop={workshop} />
          </Card>
        ))}
      </div>
    </div>
  );
};