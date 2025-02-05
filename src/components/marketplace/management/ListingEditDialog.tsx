import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ListingForm } from "../form/ListingForm";

interface ListingEditDialogProps {
  listing: any | null;
  onClose: () => void;
  onUpdate: (formData: any) => Promise<void>;
}

export const ListingEditDialog = ({
  listing,
  onClose,
  onUpdate,
}: ListingEditDialogProps) => {
  if (!listing) return null;

  return (
    <Dialog open={!!listing} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl">
        <ListingForm
          onSubmit={onUpdate}
          isLoading={false}
          initialData={listing}
        />
      </DialogContent>
    </Dialog>
  );
};