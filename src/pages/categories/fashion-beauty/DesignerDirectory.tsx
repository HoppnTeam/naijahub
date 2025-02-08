
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Scissors, MapPin, Star, Instagram } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Designer {
  id: string;
  business_name: string;
  description: string;
  specialties: string[];
  location: string;
  rating: number;
  review_count: number;
  portfolio_images: string[];
  instagram_handle: string | null;
  verified: boolean;
}

const DesignerDirectory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [specialty, setSpecialty] = useState<string>("all");

  const { data: designers, isLoading } = useQuery({
    queryKey: ["fashion-designers", searchTerm, specialty],
    queryFn: async () => {
      let query = supabase
        .from("fashion_designers")
        .select("*")
        .order("rating", { ascending: false });

      if (searchTerm) {
        query = query.ilike("business_name", `%${searchTerm}%`);
      }

      if (specialty !== "all") {
        query = query.contains("specialties", [specialty]);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Designer[];
    },
  });

  const handleRegisterAsDesigner = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to register as a fashion designer",
        variant: "destructive",
      });
      return;
    }
    navigate("/categories/fashion-beauty/designer-register");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <Scissors className="w-6 h-6 text-[#E2725B]" />
          <h1 className="text-2xl font-bold">Fashion Designer Directory</h1>
        </div>
        <Button 
          onClick={handleRegisterAsDesigner}
          className="bg-[#E2725B] hover:bg-[#E2725B]/90"
        >
          Register as Designer
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Input
          placeholder="Search designers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-72"
        />
        <Select 
          value={specialty} 
          onValueChange={setSpecialty}
        >
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Specialty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specialties</SelectItem>
            <SelectItem value="traditional">Traditional</SelectItem>
            <SelectItem value="contemporary">Contemporary</SelectItem>
            <SelectItem value="bridal">Bridal</SelectItem>
            <SelectItem value="ready_to_wear">Ready to Wear</SelectItem>
            <SelectItem value="haute_couture">Haute Couture</SelectItem>
            <SelectItem value="accessories">Accessories</SelectItem>
            <SelectItem value="footwear">Footwear</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div>Loading designers...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {designers?.map((designer) => (
            <div 
              key={designer.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {designer.portfolio_images[0] && (
                <img
                  src={designer.portfolio_images[0]}
                  alt={designer.business_name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">{designer.business_name}</h3>
                  {designer.verified && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{designer.description}</p>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{designer.location}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>{designer.rating.toFixed(1)}</span>
                    <span className="text-gray-500">({designer.review_count})</span>
                  </div>
                  {designer.instagram_handle && (
                    <a 
                      href={`https://instagram.com/${designer.instagram_handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-500 hover:text-pink-600"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <Button
                  onClick={() => navigate(`/categories/fashion-beauty/designers/${designer.id}`)}
                  variant="outline"
                  className="w-full mt-4"
                >
                  View Profile
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DesignerDirectory;
