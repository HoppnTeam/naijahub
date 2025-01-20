import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useListingSubmission = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const submitListing = async (formData: any, imageUrls: string[], userId: string) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from("tech_marketplace_listings")
        .insert({
          seller_id: userId,
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          condition: formData.condition,
          category: formData.category,
          images: imageUrls,
          location: formData.location,
          payment_methods: formData.paymentMethods,
          delivery_method: formData.deliveryMethod,
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your listing has been created",
      });
      
      navigate("/categories/technology");
    } catch (error) {
      console.error("Error creating listing:", error);
      toast({
        title: "Error",
        description: "Failed to create listing. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    submitListing
  };
};