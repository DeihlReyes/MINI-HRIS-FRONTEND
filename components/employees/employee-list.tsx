"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import {
  AddButton,
  DataTableActions,
} from "@/components/tables/data-table-actions";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import { employeeApi } from "@/lib/api";
import { Employee } from "@/types";

import PageHeader from "../layout/page-header";

interface EmployeeListProps {
  initialData?: Employee[];
}

export function EmployeeList({ initialData = [] }: EmployeeListProps) {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>(initialData);

  const handleDelete = async (id: string) => {
    try {
      await employeeApi.deleteEmployee(id);
      toast.success("Employee deleted successfully");
      setEmployees(employees.filter((emp) => emp.id !== id));
    } catch {
      toast.error("Failed to delete employee");
    }
  };

  const statusColors: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    Active: "default",
    Inactive: "secondary",
    OnLeave: "outline",
    Terminated: "destructive",
  };

  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: "employeeNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Employee #" />
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("employeeNumber")}</div>
      ),
    },
    {
      accessorKey: "firstName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        const employee = row.original;
        return <div>{`${employee.firstName} ${employee.lastName}`}</div>;
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
    },
    {
      accessorKey: "position",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Position" />
      ),
    },
    {
      accessorKey: "departmentName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Department" />
      ),
      cell: ({ row }) => {
        const department: string = row.getValue("departmentName");
        return <div>{department}</div>;
      },
    },
    {
      accessorKey: "employmentStatus",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("employmentStatus") as string;
        return (
          <Badge variant={statusColors[status] || "default"}>{status}</Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <DataTableActions
            onView={() => router.push(`/employees/${employee.id}`)}
            onEdit={() => router.push(`/employees/${employee.id}/edit`)}
            onDelete={() => handleDelete(employee.id)}
          />
        );
      },
    },
  ];

  return (
    <div className="w-full space-y-6 p-6">
      <div className="flex w-full flex-col items-center justify-between gap-5 md:flex-row md:gap-0">
        <PageHeader
          title="Employees"
          description="Manage employee records and details"
        />
        <Link className="w-full md:w-auto" href="/employees/new">
          <AddButton onClick={() => {}} label="Add Employee" />
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={employees}
        toolbar={
          <DataTableToolbar
            searchKey="firstName"
            searchPlaceholder="Search by name or email..."
          />
        }
        pagination={<DataTablePagination />}
      />
    </div>
  );
}
