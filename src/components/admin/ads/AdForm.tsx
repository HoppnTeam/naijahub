import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { AdFormSchema, adFormSchema } from "./adFormSchema";

interface AdFormProps {
  initialData?: {
    id: string;
    title: string;
    description: string;
    tier: string;
    placement: string;
    start_date: string;
    end_date: string;
    image_url?: string;
  };
}

export const AdForm = ({ initialData }: AdFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<AdFormSchema>({
    resolver: zodResolver(adFormSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      tier: "basic",
      placement: "sidebar",
      start_date: "",
      end_date: "",
    },
  });

  const onSubmit = async (values: AdFormSchema) => {
    try {
      const submissionData = {
        ...values,
        impression_count: 0,
        click_count: 0,
        title: values.title,
        description: values.description,
        tier: values.tier,
        placement: values.placement,
        start_date: values.start_date,
        end_date: values.end_date,
        status: "pending",
      };

      if (initialData?.id) {
        const { error } = await supabase
          .from("advertisements")
          .update(submissionData)
          .eq("id", initialData.id);

        if (error) throw error;
        toast({
          title: "Advertisement updated",
          description: "Your advertisement has been updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from("advertisements")
          .insert([submissionData]);

        if (error) throw error;
        toast({
          title: "Advertisement created",
          description: "Your advertisement has been created successfully.",
        });
      }

      navigate("/admin/ads");
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter advertisement title" {...field} />
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
                <Textarea
                  placeholder="Enter advertisement description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tier</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tier" />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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

        <Button type="submit">
          {initialData ? "Update Advertisement" : "Create Advertisement"}
        </Button>
      </form>
    </Form>
  );
};