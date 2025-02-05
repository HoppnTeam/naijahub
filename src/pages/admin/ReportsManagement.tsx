import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { IssueReport } from "@/components/reports/types";

export const ReportsManagement = () => {
  const { data: reports } = useQuery({
    queryKey: ["issue-reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("issue_reports")
        .select(`
          *,
          profiles!issue_reports_user_id_profiles_fkey(username)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as IssueReport[];
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Issue Reports</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Reporter</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No results.
                </TableCell>
              </TableRow>
            )}
            {reports?.map((report) => (
              <TableRow key={report.id}>
                <TableCell>
                  {format(new Date(report.created_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell>{report.profiles.username}</TableCell>
                <TableCell className="capitalize">{report.category}</TableCell>
                <TableCell>{report.subject}</TableCell>
                <TableCell>
                  <Badge
                    className={`${getStatusColor(report.status)} border-none`}
                    variant="outline"
                  >
                    {report.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};