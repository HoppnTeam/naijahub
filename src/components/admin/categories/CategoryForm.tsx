import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  parent_id: z.string().optional(),
});

interface CategoryFormProps {
  onSuccess?: () => void;
  initialData?: {
    id: string;
    name: string;
    description?: string;
    parent_id?: string;
  };
}

export function CategoryForm({ onSuccess, initialData }: CategoryFormProps) {
  const queryClient = useQueryClient();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      parent_id: initialData?.parent_id,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const dataToSubmit = {
        name: values.name,
        description: values.description,
        parent_id: values.parent_id || null,
      };

      if (initialData?.id) {
        const { error } = await supabase
          .from("categories")
          .update(dataToSubmit)
          .eq("id", initialData.id);

        if (error) throw error;
        toast.success("Category updated successfully");
      } else {
        const { error } = await supabase
          .from("categories")
          .insert(dataToSubmit);

        if (error) throw error;
        toast.success("Category created successfully");
      }

      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      onSuccess?.();
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Category name" {...field} />
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
                <Textarea placeholder="Category description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {initialData ? "Update" : "Create"} Category
        </Button>
      </form>
    </Form>
  );
}