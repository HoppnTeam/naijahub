import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Workshop } from "@/types/workshop";
import WorkshopMap from "./WorkshopMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const WorkshopDetails = () => {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const { data: workshops, isLoading } = useQuery({
    queryKey: ["workshops", userLocation],
    queryFn: async () => {
      if (!userLocation) return [];

      const { data, error } = await supabase
        .from("automotive_workshops")
        .select("*")
        .not("latitude", "is", null)
        .not("longitude", "is", null);

      if (error) throw error;

      return data;
    },
    enabled: !!userLocation,
  });

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              Workshops {workshops?.length ? `(${workshops.length} found)` : ''}
            </h2>
            {workshops?.map((workshop) => (
              <Card key={workshop.id}>
                <CardHeader>
                  <CardTitle>{workshop.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{workshop.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          {userLocation && (
            <div className="h-[600px] rounded-lg overflow-hidden">
              <WorkshopMap
                latitude={userLocation.latitude}
                longitude={userLocation.longitude}
                workshops={workshops || []}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkshopDetails;
