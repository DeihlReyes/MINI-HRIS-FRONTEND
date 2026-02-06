"use client";

import { useState } from "react";

import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { LeaveTypeForm } from "@/components/forms/leave-type-form";
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
import { leaveTypeApi } from "@/lib/api";
import { LeaveTypeFormValues } from "@/lib/validations/leave";
import { LeaveType } from "@/types";

import PageHeader from "../layout/page-header";

interface LeaveTypeListProps {
  initialData?: LeaveType[];
}

export function LeaveTypeList({ initialData = [] }: LeaveTypeListProps) {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>(initialData);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<LeaveType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      await leaveTypeApi.deleteLeaveType(id);
      toast.success("Leave type deleted successfully");
      setLeaveTypes(leaveTypes.filter((type) => type.id !== id));
    } catch {
      toast.error("Failed to delete leave type");
    }
  };

  const handleFormSubmit = async (data: LeaveTypeFormValues) => {
    setIsFormLoading(true);
    try {
      if (selectedType) {
        const updated = await leaveTypeApi.updateLeaveType(
          selectedType.id,
          data
        );
        if (updated.data) {
          setLeaveTypes(
            leaveTypes.map((type) =>
              type.id === selectedType.id ? updated.data! : type
            )
          );
        }
      } else {
        const created = await leaveTypeApi.createLeaveType(data);
        if (created.data) {
          setLeaveTypes([...leaveTypes, created.data]);
        }
      }
      setIsDialogOpen(false);
      setSelectedType(null);
      toast.success(selectedType ? "Leave type updated" : "Leave type created");
    } catch {
      toast.error("Failed to save leave type");
    } finally {
      setIsFormLoading(false);
    }
  };

  const columns: ColumnDef<LeaveType>[] = [
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
      accessorKey: "defaultDays",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Default Days" />
      ),
    },
    {
      accessorKey: "isPaid",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Paid" />
      ),
      cell: ({ row }) => {
        const isPaid = row.getValue("isPaid") as boolean;
        return (
          <Badge variant={isPaid ? "default" : "secondary"}>
            {isPaid ? "Paid" : "Unpaid"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "requiresApproval",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Requires Approval" />
      ),
      cell: ({ row }) => {
        const requires = row.getValue("requiresApproval") as boolean;
        return <div>{requires ? "Yes" : "No"}</div>;
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
        const type = row.original;
        return (
          <DataTableActions
            onEdit={() => {
              setSelectedType(type);
              setIsDialogOpen(true);
            }}
            onDelete={() => handleDelete(type.id)}
          />
        );
      },
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex w-full flex-col items-center justify-between gap-5 md:flex-row md:gap-0">
        <PageHeader
          title="Leave Types"
          description="Manage different types of leaves available in the company"
        />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <AddButton
              onClick={() => {
                setSelectedType(null);
                setIsDialogOpen(true);
              }}
              label="Add Leave Type"
            />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedType ? "Edit Leave Type" : "Create Leave Type"}
              </DialogTitle>
              <DialogDescription>
                {selectedType
                  ? "Update leave type information"
                  : "Create a new leave type"}
              </DialogDescription>
            </DialogHeader>
            <LeaveTypeForm
              leaveType={selectedType || undefined}
              onSubmit={handleFormSubmit}
              isLoading={isFormLoading}
            />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={leaveTypes}
        toolbar={
          <DataTableToolbar
            searchKey="name"
            searchPlaceholder="Search leave types..."
          />
        }
        pagination={<DataTablePagination />}
      />
    </div>
  );
}
