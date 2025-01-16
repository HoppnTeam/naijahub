import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AddWorkshopForm } from "./AddWorkshopForm";
import { WorkshopDetails } from "./WorkshopDetails";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Star, Wrench, Globe } from "lucide-react";
import { Workshop } from "@/types/workshop";

export const WorkshopsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedState, setSelectedState] = useState<string>("all");
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: workshops, isLoading } = useQuery({
    queryKey: ["workshops", selectedType, selectedState, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("automotive_workshops")
        .select("*")
        .order("rating", { ascending: false });

      if (selectedType !== "all") {
        query = query.eq("workshop_type", selectedType);
      }

      if (selectedState !== "all") {
        query = query.eq("state", selectedState);
      }

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Workshop[];
    },
  });

  const handleAddWorkshopClick = () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add a workshop",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search workshops..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:w-64"
        />
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Workshop Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="mechanic">Mechanic</SelectItem>
            <SelectItem value="auto_electrician">Auto Electrician</SelectItem>
            <SelectItem value="panel_beater">Panel Beater</SelectItem>
            <SelectItem value="tire_service">Tire Service</SelectItem>
            <SelectItem value="car_wash">Car Wash</SelectItem>
            <SelectItem value="diagnostics_center">Diagnostics Center</SelectItem>
            <SelectItem value="spare_parts">Spare Parts</SelectItem>
            <SelectItem value="general_service">General Service</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedState} onValueChange={setSelectedState}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="State" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            <SelectItem value="Lagos">Lagos</SelectItem>
            <SelectItem value="Abuja">Abuja</SelectItem>
            <SelectItem value="Rivers">Rivers</SelectItem>
            {/* Add more Nigerian states as needed */}
          </SelectContent>
        </Select>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={handleAddWorkshopClick}>Add Workshop</Button>
          </DialogTrigger>
          {user && (
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <AddWorkshopForm />
            </DialogContent>
          )}
        </Dialog>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : workshops?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-lg font-semibold text-center">No workshops found</p>
            <p className="text-muted-foreground text-center">
              {searchQuery 
                ? "Try adjusting your search terms"
                : "Be the first to add a workshop in this area"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workshops?.map((workshop) => (
            <Card 
              key={workshop.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedWorkshop(workshop)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg">{workshop.name}</span>
                  {workshop.verified && (
                    <span className="text-primary">✓ Verified</span>
                  )}
                </CardTitle>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{workshop.rating.toFixed(1)}</span>
                  <span>({workshop.review_count} reviews)</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {workshop.description}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Wrench className="w-4 h-4" />
                  <span className="capitalize">{workshop.workshop_type.replace(/_/g, " ")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{workshop.address}, {workshop.city}, {workshop.state}</span>
                </div>
                {workshop.phone_number && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4" />
                    <span>{workshop.phone_number}</span>
                  </div>
                )}
                {workshop.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="w-4 h-4" />
                    <a 
                      href={workshop.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedWorkshop && (
        <WorkshopDetails
          workshop={selectedWorkshop}
          isOpen={!!selectedWorkshop}
          onClose={() => setSelectedWorkshop(null)}
        />
      )}
    </div>
  );
};