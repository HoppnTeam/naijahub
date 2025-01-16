import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface Advertisement {
  id: string;
  title: string;
  description: string;
  tier: string;
  placement: string;
  start_date: string;
  end_date: string;
  status: string;
  click_count: number;
  impression_count: number;
}

export const columns: ColumnDef<Advertisement>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "tier",
    header: "Tier",
  },
  {
    accessorKey: "placement",
    header: "Placement",
  },
  {
    accessorKey: "start_date",
    header: "Start Date",
    cell: ({ row }) => formatDate(row.getValue("start_date")),
  },
  {
    accessorKey: "end_date",
    header: "End Date",
    cell: ({ row }) => formatDate(row.getValue("end_date")),
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "click_count",
    header: "Clicks",
  },
  {
    accessorKey: "impression_count",
    header: "Impressions",
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const ad = row.original;
      return (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            const meta = table.options.meta as { onEdit: (ad: Advertisement) => void };
            meta?.onEdit?.(ad);
          }}
        >
          Edit
        </Button>
      );
    },
  },
];