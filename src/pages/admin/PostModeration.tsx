import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { ViolationTable } from "@/components/admin/post-moderation/ViolationTable";
import { ReviewViolationDialog } from "@/components/admin/post-moderation/ReviewViolationDialog";
import { PostViolation } from "@/components/admin/post-moderation/types";

const PostModeration = () => {
  const [selectedViolation, setSelectedViolation] = useState<PostViolation | null>(null);
  const [actionNotes, setActionNotes] = useState("");
  const [selectedAction, setSelectedAction] = useState<string>("");
  const { toast } = useToast();

  const { data: violations, isLoading, refetch } = useQuery({
    queryKey: ["post-violations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("post_violations")
        .select(`
          *,
          post:posts (
            id,
            title,
            content,
            profiles (username)
          )
        `)
        .order("detected_at", { ascending: false });

      if (error) throw error;
      return data as PostViolation[];
    },
  });

  const handleReviewViolation = async () => {
    if (!selectedViolation || !selectedAction) return;

    try {
      const { error } = await supabase
        .from("post_violations")
        .update({
          status: "reviewed",
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id,
          action_taken: `${selectedAction}: ${actionNotes}`,
        })
        .eq("id", selectedViolation.id);

      if (error) throw error;

      if (selectedAction === "remove_post") {
        const { error: deleteError } = await supabase
          .from("posts")
          .delete()
          .eq("id", selectedViolation.post.id);

        if (deleteError) throw deleteError;
      }

      toast({
        title: "Review submitted",
        description: "The violation has been reviewed and action has been taken.",
      });

      handleCloseDialog();
      refetch();
    } catch (error) {
      console.error("Error reviewing violation:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit review. Please try again.",
      });
    }
  };

  const handleCloseDialog = () => {
    setSelectedViolation(null);
    setActionNotes("");
    setSelectedAction("");
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Content Moderation</h1>
        </div>

        <ViolationTable
          violations={violations || []}
          isLoading={isLoading}
          onReviewClick={setSelectedViolation}
        />

        <ReviewViolationDialog
          violation={selectedViolation}
          actionNotes={actionNotes}
          selectedAction={selectedAction}
          onActionNotesChange={setActionNotes}
          onActionChange={setSelectedAction}
          onClose={handleCloseDialog}
          onSubmit={handleReviewViolation}
        />
      </div>
    </AdminLayout>
  );
};

export default PostModeration;