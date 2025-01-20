import { useAuth } from "@/contexts/AuthContext";
import { useFormState } from "./marketplace/use-form-state";
import { useImageUpload } from "./marketplace/use-image-upload";
import { useListingSubmission } from "./marketplace/use-listing-submission";
import { useToast } from "./use-toast";

export type PaymentMethod = "online" | "cash_on_delivery" | "in_person";
export type DeliveryMethod = "shipping" | "pickup" | "both";

interface UseCreateListingProps {
  onSuccess?: () => void;
}

export const useCreateListing = ({ onSuccess }: UseCreateListingProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { formData } = useFormState();
  const { selectedFiles, setSelectedFiles, uploadImages } = useImageUpload(user?.id);
  const { isLoading, submitListing } = useListingSubmission();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to create a listing",
        variant: "destructive",
      });
      return;
    }

    try {
      const imageUrls = await uploadImages();
      await submitListing(formData, imageUrls, user.id);
      if (onSuccess) onSuccess();
    } catch (error) {
      // Error handling is done in the individual hooks
      console.error("Error in handleSubmit:", error);
    }
  };

  return {
    formData,
    isLoading,
    handleSubmit,
    selectedFiles,
    setSelectedFiles,
  };
};