import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PAYMENT_METHODS = ["online", "cash_on_delivery", "in_person"] as const;
const DELIVERY_METHODS = ["shipping", "pickup", "both"] as const;

export type PaymentMethod = typeof PAYMENT_METHODS[number];
export type DeliveryMethod = typeof DELIVERY_METHODS[number];

interface UseCreateListingProps {
  onSuccess?: () => void;
}

export const useCreateListing = ({ onSuccess }: UseCreateListingProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("shipping");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);
    
    try {
      const imageUrls: string[] = [];
      for (const file of selectedFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('post-images')
          .getPublicUrl(filePath);

        imageUrls.push(publicUrl);
      }

      const { error } = await supabase
        .from("tech_marketplace_listings")
        .insert({
          seller_id: user.id,
          title,
          description,
          price: parseFloat(price),
          condition,
          category,
          images: imageUrls,
          location,
          payment_methods: paymentMethods,
          delivery_method: deliveryMethod,
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your listing has been created",
      });
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/categories/technology");
      }
    } catch (error) {
      console.error("Error creating listing:", error);
      toast({
        title: "Error",
        description: "Failed to create listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData: {
      title,
      setTitle,
      description,
      setDescription,
      price,
      setPrice,
      condition,
      setCondition,
      category,
      setCategory,
      location,
      setLocation,
      paymentMethods,
      setPaymentMethods,
      deliveryMethod,
      setDeliveryMethod,
      selectedFiles,
      setSelectedFiles,
    },
    isLoading,
    handleSubmit,
  };
};