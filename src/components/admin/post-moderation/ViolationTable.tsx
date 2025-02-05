import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { PostViolation } from "./types";

interface ViolationTableProps {
  violations: PostViolation[];
  isLoading: boolean;
  onReviewClick: (violation: PostViolation) => void;
}

export const ViolationTable = ({ violations, isLoading, onReviewClick }: ViolationTableProps) => {
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
          onClick={() => onReviewClick(row.original)}
          disabled={row.original.status === "reviewed"}
        >
          Review
        </Button>
      ),
    },
  ];

  return <DataTable columns={columns} data={violations || []} isLoading={isLoading} />;
};