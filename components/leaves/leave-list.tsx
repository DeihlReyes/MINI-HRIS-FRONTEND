"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Leave } from "@/types";

import PageHeader from "../layout/page-header";

interface LeaveListProps {
  initialData?: Leave[];
  userRole?: "HR" | "Employee";
  userEmployeeId?: string;
}

export function LeaveList({
  initialData = [],
  userRole = "HR",
}: LeaveListProps) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const isEmployeeRole = userRole === "Employee";

  const statusColors: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    Pending: "outline",
    Approved: "default",
    Rejected: "destructive",
    Cancelled: "secondary",
  };

  // Filter data by status
  const filteredData =
    statusFilter === "all"
      ? initialData
      : initialData.filter((leave) => leave.status === statusFilter);

  // Define base columns (always visible)
  const baseColumns: ColumnDef<Leave>[] = [
    {
      accessorKey: "leaveTypeName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Leave Type" />
      ),
      cell: ({ row }) => {
        const leaveType: string = row.getValue("leaveTypeName");
        return <div>{leaveType || "-"}</div>;
      },
    },
    {
      accessorKey: "startDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Start Date" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("startDate"));
        return <div>{date.toLocaleDateString()}</div>;
      },
    },
    {
      accessorKey: "endDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="End Date" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("endDate"));
        return <div>{date.toLocaleDateString()}</div>;
      },
    },
    {
      accessorKey: "totalDays",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Days" />
      ),
      cell: ({ row }) => (
        <div className="text-center font-semibold">
          {row.getValue("totalDays")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return <Badge variant={statusColors[status]}>{status}</Badge>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const leave = row.original;
        return (
          <div className="text-right">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/leaves/${leave.id}`)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  // Define employee name column (only for HR)
  const employeeNameColumn: ColumnDef<Leave> = {
    accessorKey: "employeeName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Employee" />
    ),
    cell: ({ row }) => {
      const name: string = row.getValue("employeeName");
      return <div className="font-medium">{name || "-"}</div>;
    },
  };

  // Combine columns based on role
  const columns = isEmployeeRole
    ? baseColumns
    : [employeeNameColumn, ...baseColumns];

  return (
    <div className="space-y-6 p-6">
      <div className="flex w-full flex-col items-center justify-between gap-5 md:flex-row md:gap-0">
        <PageHeader
          title="Leaves"
          description={
            isEmployeeRole
              ? "View and manage your leave applications"
              : "Manage all employee leave applications"
          }
        />
        <Link className="w-full md:w-auto" href="/leaves/new">
          <Button className="w-full md:w-auto">Apply for Leave</Button>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        toolbar={
          <DataTableToolbar
            searchKey={isEmployeeRole ? undefined : "employeeName"}
            searchPlaceholder={
              isEmployeeRole ? undefined : "Search by employee name..."
            }
            filters={
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8 w-full md:w-37.5">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            }
          />
        }
        pagination={<DataTablePagination />}
      />
    </div>
  );
}
