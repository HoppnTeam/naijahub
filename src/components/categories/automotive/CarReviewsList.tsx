import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Video, Image as ImageIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CarReviewForm } from "./CarReviewForm";

export const CarReviewsList = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["car-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("car_reviews")
        .select(`
          *,
          profiles:profiles(username, avatar_url)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Car Reviews</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Write a Review</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Write a Car Review</DialogTitle>
            </DialogHeader>
            <CarReviewForm onSuccess={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {reviews?.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={review.profiles?.avatar_url ?? undefined} />
                    <AvatarFallback>
                      {review.profiles?.username?.substring(0, 2).toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{review.profiles?.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <CardTitle className="text-xl mt-4">
                {review.year} {review.make} {review.model}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{review.content}</p>
              
              {(review.pros?.length > 0 || review.cons?.length > 0) && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {review.pros?.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-green-600 mb-2">Pros</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {review.pros.map((pro, index) => (
                          <li key={index}>{pro}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {review.cons?.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-red-600 mb-2">Cons</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {review.cons.map((con, index) => (
                          <li key={index}>{con}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {(review.image_url || review.video_url) && (
                <div className="flex items-center gap-4 mt-4">
                  {review.image_url && (
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      <a href={review.image_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        View Image
                      </a>
                    </div>
                  )}
                  {review.video_url && (
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      <a href={review.video_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Watch Video Review
                      </a>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};