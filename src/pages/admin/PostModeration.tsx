import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PostModerationTable } from "@/components/admin/posts/PostModerationTable";
import { PostModerationFilters } from "@/components/admin/posts/PostModerationFilters";

export const PostModeration = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name");
      if (error) throw error;
      return data;
    },
  });

  const { data: posts, isLoading } = useQuery({
    queryKey: ["moderated-posts", selectedCategory, selectedStatus],
    queryFn: async () => {
      let query = supabase
        .from("posts")
        .select(`
          *,
          profiles (username),
          categories (name),
          moderation_reports (id)
        `);

      if (selectedCategory) {
        query = query.eq("category_id", selectedCategory);
      }

      if (selectedStatus === "reported") {
        query = query.not("moderation_reports", "is", null);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Post Moderation</h1>
        <PostModerationFilters
          categories={categories || []}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />
        <PostModerationTable posts={posts || []} isLoading={isLoading} />
      </div>
    </AdminLayout>
  );
};

export default PostModeration;