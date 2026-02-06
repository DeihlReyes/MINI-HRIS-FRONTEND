"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { DepartmentForm } from "@/components/forms/department-form";
import {
  AddButton,
  DataTableActions,
} from "@/components/tables/data-table-actions";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { departmentApi } from "@/lib/api";
import { DepartmentFormValues } from "@/lib/validations/department";
import { Department, Employee } from "@/types";

import PageHeader from "../layout/page-header";

interface DepartmentListProps {
  initialData?: Department[];
  initialEmployees?: Employee[];
}

export function DepartmentList({
  initialData = [],
  initialEmployees = [],
}: DepartmentListProps) {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>(initialData);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      await departmentApi.deleteDepartment(id);
      toast.success("Department deleted successfully");
      setDepartments(departments.filter((dept) => dept.id !== id));
      router.refresh();
    } catch {
      toast.error("Failed to delete department");
    }
  };

  const handleFormSubmit = async (data: DepartmentFormValues) => {
    setIsFormLoading(true);
    try {
      if (selectedDept) {
        const updated = await departmentApi.updateDepartment(
          selectedDept.id,
          data
        );
        if (updated.data) {
          setDepartments(
            departments.map((d) =>
              d.id === selectedDept.id ? updated.data! : d
            )
          );
        }
      } else {
        const created = await departmentApi.createDepartment(data);
        if (created.data) {
          setDepartments([...departments, created.data]);
        }
      }
      setIsDialogOpen(false);
      setSelectedDept(null);
      toast.success(selectedDept ? "Department updated" : "Department created");
    } catch {
      toast.error("Failed to save department");
    } finally {
      setIsFormLoading(false);
    }
  };

  const columns: ColumnDef<Department>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "code",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Code" />
      ),
    },
    {
      accessorKey: "managerName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Manager" />
      ),
      cell: ({ row }) => {
        const manager = row.getValue("managerName") as
          | string
          | null
          | undefined;
        return <div>{manager ? manager : "-"}</div>;
      },
    },
    {
      accessorKey: "isActive",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        return (
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const dept = row.original;
        return (
          <DataTableActions
            onEdit={() => {
              setSelectedDept(dept);
              setIsDialogOpen(true);
            }}
            onDelete={() => handleDelete(dept.id)}
          />
        );
      },
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex w-full flex-col items-center justify-between gap-5 md:flex-row md:gap-0">
        <PageHeader
          title="Departments"
          description="Manage company departments and their details"
        />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <AddButton
              onClick={() => {
                setSelectedDept(null);
                setIsDialogOpen(true);
              }}
              label="Add Department"
            />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedDept ? "Edit Department" : "Create Department"}
              </DialogTitle>
              <DialogDescription>
                {selectedDept
                  ? "Update department information"
                  : "Create a new department"}
              </DialogDescription>
            </DialogHeader>
            <DepartmentForm
              department={selectedDept || undefined}
              employees={initialEmployees}
              onSubmit={handleFormSubmit}
              isLoading={isFormLoading}
            />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={departments}
        toolbar={
          <DataTableToolbar
            searchKey="name"
            searchPlaceholder="Search departments..."
          />
        }
        pagination={<DataTablePagination />}
      />
    </div>
  );
}
