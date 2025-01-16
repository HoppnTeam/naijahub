import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/posts/ImageUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { ProductDetailsFields } from "./form/ProductDetailsFields";
import { DeliveryMethodFields } from "./form/DeliveryMethodFields";

const PAYMENT_METHODS = ["online", "cash_on_delivery", "in_person"] as const;
const DELIVERY_METHODS = ["shipping", "pickup", "both"] as const;

export const CreateListingForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<typeof PAYMENT_METHODS[number][]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState<typeof DELIVERY_METHODS[number]>("shipping");
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
      // Upload images
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

      // Create listing
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
      
      navigate("/categories/technology");
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Listing</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <BasicInfoFields
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
          />
          
          <ProductDetailsFields
            price={price}
            setPrice={setPrice}
            condition={condition}
            setCondition={setCondition}
            category={category}
            setCategory={setCategory}
            location={location}
            setLocation={setLocation}
          />

          <DeliveryMethodFields
            paymentMethods={paymentMethods}
            setPaymentMethods={setPaymentMethods}
            deliveryMethod={deliveryMethod}
            setDeliveryMethod={setDeliveryMethod}
          />

          <ImageUpload onImagesChange={setSelectedFiles} />
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Listing"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};