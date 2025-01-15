import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/posts/ImageUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CONDITIONS = ["New", "Like New", "Good", "Fair"];
const CATEGORIES = ["Phones & Tablets", "Computers", "Electronics", "Accessories", "Gaming", "Other"];
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

        const { error: uploadError, data } = await supabase.storage
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
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter product title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your product"
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₦)</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {CONDITIONS.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your location"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Payment Methods</Label>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_METHODS.map((method) => (
                <Button
                  key={method}
                  type="button"
                  variant={paymentMethods.includes(method) ? "default" : "outline"}
                  onClick={() => {
                    setPaymentMethods(prev =>
                      prev.includes(method)
                        ? prev.filter(m => m !== method)
                        : [...prev, method]
                    );
                  }}
                >
                  {method.replace(/_/g, ' ')}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Delivery Method</Label>
            <div className="flex flex-wrap gap-2">
              {DELIVERY_METHODS.map((method) => (
                <Button
                  key={method}
                  type="button"
                  variant={deliveryMethod === method ? "default" : "outline"}
                  onClick={() => setDeliveryMethod(method)}
                >
                  {method}
                </Button>
              ))}
            </div>
          </div>

          <ImageUpload onImagesChange={setSelectedFiles} />
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Listing"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
