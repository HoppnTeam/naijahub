import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdForm } from "@/components/admin/ads/AdForm";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./ads/columns";

export const AdsManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState<any>(null);

  const { data: advertisements, isLoading } = useQuery({
    queryKey: ["advertisements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("advertisements")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleCreate = () => {
    setSelectedAd(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (ad: any) => {
    setSelectedAd(ad);
    setIsDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Advertisements</h1>
        <Button onClick={handleCreate}>Create Advertisement</Button>
      </div>

      <DataTable
        columns={columns}
        data={advertisements || []}
        isLoading={isLoading}
        onEdit={handleEdit}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedAd ? "Edit Advertisement" : "Create Advertisement"}
            </DialogTitle>
          </DialogHeader>
          <AdForm 
            initialData={selectedAd} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};