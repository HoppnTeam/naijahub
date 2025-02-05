import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ReportsTable } from "@/components/reports/ReportsTable";
import { ReportDetailsDialog } from "@/components/reports/ReportDetailsDialog";
import type { IssueReport } from "@/components/reports/types";

export const ReportsManagement = () => {
  const [selectedReport, setSelectedReport] = useState<IssueReport | null>(null);
  const { toast } = useToast();

  const { data: reports, isLoading, refetch } = useQuery({
    queryKey: ["issue-reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("issue_reports")
        .select(`
          *,
          profiles!issue_reports_user_id_fkey(username)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform the data to match IssueReport type
      return data.map((report) => ({
        ...report,
        user: {
          username: report.profiles.username
        }
      })) as IssueReport[];
    },
  });

  const handleResolveReport = async (resolutionNotes: string) => {
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

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Issue Reports</h1>
        </div>

        <ReportsTable
          reports={reports || []}
          isLoading={isLoading}
          onViewDetails={setSelectedReport}
        />

        <ReportDetailsDialog
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onResolve={handleResolveReport}
        />
      </div>
    </AdminLayout>
  );
};