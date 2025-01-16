import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/posts/ImageUpload";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Review content is required"),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().regex(/^\d{4}$/, "Please enter a valid year"),
  rating: z.string().regex(/^[1-5]$/, "Rating must be between 1 and 5"),
  pros: z.string(),
  cons: z.string(),
  video_url: z.string().url().optional().or(z.literal("")),
});

interface CarReviewFormProps {
  onSuccess: () => void;
}

export const CarReviewForm = ({ onSuccess }: CarReviewFormProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth(); // Add this line to get the current user

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      make: "",
      model: "",
      year: "",
      rating: "",
      pros: "",
      cons: "",
      video_url: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a review",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const { error } = await supabase.from("car_reviews").insert({
        user_id: user.id, // Add the user_id
        title: values.title,
        content: values.content,
        make: values.make,
        model: values.model,
        year: parseInt(values.year),
        rating: parseInt(values.rating),
        pros: values.pros.split("\n").filter(Boolean),
        cons: values.cons.split("\n").filter(Boolean),
        image_url: imageUrl,
        video_url: values.video_url || null,
      });

      if (error) throw error;

      toast({
        title: "Review submitted successfully!",
        description: "Your car review has been published.",
      });

      queryClient.invalidateQueries({ queryKey: ["car-reviews"] });
      onSuccess();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error submitting review",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Review Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter a title for your review" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="make"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Make</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Toyota" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Camry" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 2023" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating (1-5)</FormLabel>
              <FormControl>
                <Input type="number" min="1" max="5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Review Content</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Write your detailed review here..." 
                  className="min-h-[150px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="pros"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pros (one per line)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter pros, one per line"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cons"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cons (one per line)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter cons, one per line"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="video_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video Review URL (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter YouTube or video URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ImageUpload
          onImageUploaded={setImageUrl}
          currentImageUrl={imageUrl}
          className="w-full"
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </Form>
  );
};
