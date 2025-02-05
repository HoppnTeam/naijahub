import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CategoryForm } from "./CategoryForm";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  parent_id: string | null;
  subcategories?: Category[];
}

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "subcategories",
    header: "Subcategories",
    cell: ({ row }) => {
      const subcategories = row.original.subcategories;
      return (
        <div>
          {subcategories?.length 
            ? subcategories.map(sub => sub.name).join(", ")
            : "No subcategories"
          }
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const category = row.original;
      const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
      const queryClient = useQueryClient();

      const handleDelete = async () => {
        try {
          const { error } = await supabase
            .from("categories")
            .delete()
            .eq("id", category.id);

          if (error) throw error;

          queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
          toast.success("Category deleted successfully");
        } catch (error) {
          toast.error("Failed to delete category");
          console.error(error);
        }
      };

      return (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DialogTrigger asChild>
                <DropdownMenuItem>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
            </DialogHeader>
            <CategoryForm 
              initialData={category} 
              onSuccess={() => setIsEditDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      );
    },
  },
];