import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { IssueReport } from "./types";

interface ReportsTableProps {
  reports: IssueReport[];
  isLoading: boolean;
  onViewDetails: (report: IssueReport) => void;
}

export const ReportsTable = ({ reports, isLoading, onViewDetails }: ReportsTableProps) => {
  const columns: ColumnDef<IssueReport>[] = [
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => format(new Date(row.original.created_at), "MMM d, yyyy"),
    },
    {
      accessorKey: "user.username",
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
          onClick={() => onViewDetails(row.original)}
          disabled={row.original.status === "resolved"}
        >
          View Details
        </Button>
      ),
    },
  ];

  return <DataTable columns={columns} data={reports} isLoading={isLoading} />;
};