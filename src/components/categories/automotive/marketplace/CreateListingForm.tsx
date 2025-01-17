import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/posts/ImageUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { VehicleDetailsFields } from "./form/VehicleDetailsFields";
import { LocationField } from "./form/LocationField";

const VEHICLE_TYPES = ["car", "motorcycle", "tricycle", "truck", "bus", "van", "parts"] as const;
const CONDITIONS = ["New", "Like New", "Good", "Fair", "Poor"] as const;

export const CreateListingForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [vehicleType, setVehicleType] = useState<typeof VEHICLE_TYPES[number]>("car");
  const [condition, setCondition] = useState<typeof CONDITIONS[number]>("Good");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
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

    if (!coordinates) {
      toast({
        title: "Invalid Location",
        description: "Please enter and validate a location",
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
          title,
          description,
          price: parseFloat(price),
          vehicle_type: vehicleType,
          condition,
          make,
          model,
          year: year ? parseInt(year) : null,
          images: imageUrls,
          location,
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
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
        <CardTitle>Create Auto Listing</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <BasicInfoFields
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
          />
          
          <VehicleDetailsFields
            price={price}
            setPrice={setPrice}
            vehicleType={vehicleType}
            setVehicleType={setVehicleType}
            condition={condition}
            setCondition={setCondition}
            make={make}
            setMake={setMake}
            model={model}
            setModel={setModel}
            year={year}
            setYear={setYear}
          />

          <LocationField
            location={location}
            setLocation={setLocation}
            setCoordinates={setCoordinates}
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