import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type PostViolation = {
  id: string;
  post_id: string;
  post: {
    id: string;
    title: string;
    content: string;
    profiles: {
      username: string;
    };
  };
  violation_type: string;
  description: string;
  status: string;
  detected_at: string;
  reviewed_at: string | null;
  action_taken: string | null;
};

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
        // Delete the violating post
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

      setSelectedViolation(null);
      setActionNotes("");
      setSelectedAction("");
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

  const columns: ColumnDef<PostViolation>[] = [
    {
      accessorKey: "detected_at",
      header: "Date",
      cell: ({ row }) => format(new Date(row.original.detected_at), "MMM d, yyyy"),
    },
    {
      accessorKey: "post.profiles.username",
      header: "Author",
    },
    {
      accessorKey: "post.title",
      header: "Post Title",
    },
    {
      accessorKey: "violation_type",
      header: "Violation Type",
      cell: ({ row }) => (
        <span className="capitalize">{row.original.violation_type.replace(/_/g, " ")}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.status === "pending" ? "secondary" : "outline"}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedViolation(row.original)}
          disabled={row.original.status === "reviewed"}
        >
          Review
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Content Moderation</h1>
        </div>

        <DataTable
          columns={columns}
          data={violations || []}
          isLoading={isLoading}
        />

        <Dialog open={!!selectedViolation} onOpenChange={() => setSelectedViolation(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Review Content Violation</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Post Title</Label>
                <p>{selectedViolation?.post.title}</p>
              </div>

              <div>
                <Label>Content</Label>
                <p className="whitespace-pre-wrap">{selectedViolation?.post.content}</p>
              </div>

              <div>
                <Label>Violation Type</Label>
                <p className="capitalize">{selectedViolation?.violation_type.replace(/_/g, " ")}</p>
              </div>

              <div>
                <Label>Description</Label>
                <p>{selectedViolation?.description}</p>
              </div>

              <div className="space-y-2">
                <Label>Action</Label>
                <Select value={selectedAction} onValueChange={setSelectedAction}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select action to take" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="warning">Send Warning</SelectItem>
                    <SelectItem value="remove_post">Remove Post</SelectItem>
                    <SelectItem value="dismiss">Dismiss Violation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder="Add notes about the action taken..."
                  className="min-h-[100px]"
                />
              </div>

              <Button onClick={handleReviewViolation} className="w-full">
                Submit Review
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default PostModeration;