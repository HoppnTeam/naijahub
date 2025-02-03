import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

type IssueReport = {
  id: string;
  user_id: string;
  category: string;
  subject: string;
  description: string;
  image_url?: string;
  status: string;
  created_at: string;
  resolved_by?: string;
  resolution_notes?: string;
  resolved_at?: string;
  profiles: {
    username: string;
  };
};

export const ReportsManagement = () => {
  const [selectedReport, setSelectedReport] = useState<IssueReport | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const { toast } = useToast();

  const { data: reports, isLoading, refetch } = useQuery({
    queryKey: ["issue-reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("issue_reports")
        .select(`
          *,
          profiles:user_id (username)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as IssueReport[];
    },
  });

  const handleResolveReport = async () => {
    if (!selectedReport) return;

    try {
      const { error } = await supabase
        .from("issue_reports")
        .update({
          status: "resolved",
          resolution_notes: resolutionNotes,
          resolved_at: new Date().toISOString(),
          resolved_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq("id", selectedReport.id);

      if (error) throw error;

      toast({
        title: "Report resolved successfully",
        description: "The issue has been marked as resolved.",
      });

      setSelectedReport(null);
      setResolutionNotes("");
      refetch();
    } catch (error) {
      console.error("Error resolving report:", error);
      toast({
        variant: "destructive",
        title: "Error resolving report",
        description: "Please try again later.",
      });
    }
  };

  const columns: ColumnDef<IssueReport>[] = [
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => format(new Date(row.original.created_at), "MMM d, yyyy"),
    },
    {
      accessorKey: "profiles.username",
      header: "Reporter",
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <span className="capitalize">{row.original.category}</span>
      ),
    },
    {
      accessorKey: "subject",
      header: "Subject",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.status === "pending" ? "secondary" : "success"}>
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
          onClick={() => setSelectedReport(row.original)}
          disabled={row.original.status === "resolved"}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Issue Reports</h1>
        </div>

        <DataTable
          columns={columns}
          data={reports || []}
          isLoading={isLoading}
        />

        <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Issue Report Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Category</Label>
                <p className="capitalize">{selectedReport?.category}</p>
              </div>

              <div>
                <Label>Subject</Label>
                <p>{selectedReport?.subject}</p>
              </div>

              <div>
                <Label>Description</Label>
                <p className="whitespace-pre-wrap">{selectedReport?.description}</p>
              </div>

              {selectedReport?.image_url && (
                <div>
                  <Label>Attached Image</Label>
                  <img
                    src={selectedReport.image_url}
                    alt="Report attachment"
                    className="mt-2 max-h-[300px] rounded-md"
                  />
                </div>
              )}

              {selectedReport?.status === "pending" && (
                <div className="space-y-2">
                  <Label htmlFor="resolution">Resolution Notes</Label>
                  <Textarea
                    id="resolution"
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Enter resolution notes..."
                    className="min-h-[100px]"
                  />
                  <Button onClick={handleResolveReport} className="w-full">
                    Mark as Resolved
                  </Button>
                </div>
              )}

              {selectedReport?.status === "resolved" && (
                <div>
                  <Label>Resolution Notes</Label>
                  <p className="whitespace-pre-wrap">{selectedReport.resolution_notes}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Resolved on {format(new Date(selectedReport.resolved_at!), "MMM d, yyyy")}
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};