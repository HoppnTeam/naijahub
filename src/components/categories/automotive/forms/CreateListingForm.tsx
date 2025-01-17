import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/posts/ImageUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VehicleForm } from "./VehicleForm";
import { PartsForm } from "./PartsForm";
import type { Database } from "@/integrations/supabase/types";

type VehicleType = Database["public"]["Enums"]["vehicle_type"];

export const CreateListingForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: any, section: 'vehicles' | 'parts') => {
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
        .from("auto_marketplace_listings")
        .insert({
          seller_id: user.id,
          images: imageUrls,
          section,
          status: 'active',
          ...formData
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your listing has been created",
      });
      
      navigate("/categories/automotive");
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
        <Tabs defaultValue="vehicles" className="w-full">
          <TabsList>
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            <TabsTrigger value="parts">Parts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="vehicles">
            <VehicleForm 
              onSubmit={(data) => handleSubmit(data, 'vehicles')}
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="parts">
            <PartsForm 
              onSubmit={(data) => handleSubmit(data, 'parts')}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <ImageUpload 
            onImagesChange={setSelectedFiles}
            multiple
          />
        </div>
      </CardContent>
    </Card>
  );
};