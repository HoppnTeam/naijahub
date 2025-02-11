
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { BeautyProfessionalFormValues } from "@/schemas/beauty-professional";

export const useBeautyProfessionalRegistration = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: BeautyProfessionalFormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      // Upload portfolio images
      const imageUrls: string[] = [];
      for (const image of images) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `beauty-portfolios/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        imageUrls.push(publicUrl);
      }

      // Create professional profile
      const { error } = await supabase
        .from("beauty_professional_portfolios")
        .insert({
          business_name: values.business_name,
          description: values.description,
          years_experience: values.years_experience,
          location: values.location,
          contact_email: values.contact_email,
          contact_phone: values.contact_phone,
          instagram_handle: values.instagram_handle,
          website: values.website || null,
          specialties: values.specialties,
          professional_type: values.professional_type,
          portfolio_images: imageUrls,
          user_id: user.id,
          rating: 0,
          review_count: 0,
          verified: false
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your professional profile has been created",
      });

      navigate("/categories/fashion-beauty/business-hub/professionals");
    } catch (error) {
      console.error("Error creating professional profile:", error);
      toast({
        title: "Error",
        description: "Failed to create professional profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    images,
    setImages,
    isSubmitting,
    handleSubmit
  };
};
