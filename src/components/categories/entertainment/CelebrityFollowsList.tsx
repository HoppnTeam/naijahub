import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface CelebrityFollow {
  id: string;
  celebrity_name: string;
  reason: string | null;
}

export const CelebrityFollowsList = () => {
  const { data: celebrityFollows } = useQuery({
    queryKey: ["celebrity-follows"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("celebrity_follows")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as CelebrityFollow[];
    },
  });

  if (!celebrityFollows || celebrityFollows.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="font-semibold mb-2">Your Celebrity Follows</h3>
      <div className="space-y-2">
        {celebrityFollows.map((follow) => (
          <Card key={follow.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{follow.celebrity_name}</p>
                  {follow.reason && (
                    <p className="text-sm text-muted-foreground">
                      {follow.reason}
                    </p>
                  )}
                </div>
                <Star className="h-4 w-4 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};