import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const adFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  tier: z.enum(["basic", "standard", "premium", "enterprise"]),
  placement: z.enum(["sidebar", "feed", "banner", "popup"]),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  image_url: z.string().optional(),
  status: z.string().default("pending"),
});

type AdFormValues = z.infer<typeof adFormSchema>;

interface AdFormProps {
  initialData?: AdFormValues & { id: string };
  onSuccess: () => void;
}

export function AdForm({ initialData, onSuccess }: AdFormProps) {
  const { toast } = useToast();
  const form = useForm<AdFormValues>({
    resolver: zodResolver(adFormSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      tier: "basic",
      placement: "sidebar",
      start_date: new Date().toISOString().split("T")[0],
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      image_url: "",
      status: "pending",
    },
  });

  const onSubmit = async (values: AdFormValues) => {
    try {
      const submissionData = {
        ...values,
        impression_count: 0,
        click_count: 0,
      };

      if (initialData?.id) {
        const { error } = await supabase
          .from("advertisements")
          .update(submissionData)
          .eq("id", initialData.id);

        if (error) throw error;
        toast({
          title: "Advertisement updated",
          description: "The advertisement has been updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from("advertisements")
          .insert(submissionData);
        if (error) throw error;
        toast({
          title: "Advertisement created",
          description: "The advertisement has been created successfully.",
        });
      }
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Advertisement title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Advertisement description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="tier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tier</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="placement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Placement</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select placement" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sidebar">Sidebar</SelectItem>
                    <SelectItem value="feed">Feed</SelectItem>
                    <SelectItem value="banner">Banner</SelectItem>
                    <SelectItem value="popup">Popup</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="Advertisement image URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {initialData ? "Update Advertisement" : "Create Advertisement"}
        </Button>
      </form>
    </Form>
  );
}