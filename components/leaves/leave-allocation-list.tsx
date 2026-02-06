"use client";

import { useEffect, useState } from "react";

import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/contexts";
import { employeeApi, leaveAllocationApi } from "@/lib/api";
import { Employee, LeaveAllocation } from "@/types";

import PageHeader from "../layout/page-header";

interface LeaveAllocationListProps {
  initialData?: LeaveAllocation[];
}

// Define columns for the data table
const columns: ColumnDef<LeaveAllocation>[] = [
  {
    accessorKey: "employeeName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Employee" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("employeeName") || "-"}</div>
    ),
  },
  {
    accessorKey: "leaveTypeName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Leave Type" />
    ),
    cell: ({ row }) => <div>{row.getValue("leaveTypeName") || "-"}</div>,
  },
  {
    accessorKey: "allocatedDays",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Allocated" />
    ),
    cell: ({ row }) => <div>{row.getValue("allocatedDays")}</div>,
  },
  {
    accessorKey: "usedDays",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Used" />
    ),
    cell: ({ row }) => (
      <div className="font-semibold text-orange-600">
        {row.getValue("usedDays") || 0}
      </div>
    ),
  },
  {
    accessorKey: "remainingDays",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Remaining" />
    ),
    cell: ({ row }) => (
      <div className="font-semibold text-green-600">
        {row.original.remainingDays || row.original.allocatedDays}
      </div>
    ),
  },
  {
    id: "balance",
    header: "Balance",
    cell: ({ row }) => {
      const allocation = row.original;
      const remaining = allocation.remainingDays || allocation.allocatedDays;
      const percentage = (remaining / allocation.allocatedDays) * 100;

      return (
        <div className="w-32 space-y-1">
          <Progress value={percentage} className="h-2" />
          <p className="text-xs text-gray-600">
            {remaining}/{allocation.allocatedDays}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "year",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Year" />
    ),
    cell: ({ row }) => <div>{row.getValue("year")}</div>,
  },
];

export function LeaveAllocationList({
  initialData = [],
}: LeaveAllocationListProps) {
  const { role } = useUser();
  const isHR = role === "HR";
  const [allocations, setAllocations] =
    useState<LeaveAllocation[]>(initialData);
  const [isAutoAllocating, setIsAutoAllocating] = useState(false);
  const [allocationProgress, setAllocationProgress] = useState({
    current: 0,
    total: 0,
  });
  const [yearFilter, setYearFilter] = useState<string>(
    new Date().getFullYear().toString()
  );

  // Load allocations when year filter changes
  useEffect(() => {
    loadAllocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearFilter]);

  const loadAllocations = async () => {
    try {
      const allocResponse = await leaveAllocationApi.getAllAllocations();
      if (allocResponse.data) {
        const allocs = Array.isArray(allocResponse.data)
          ? allocResponse.data
          : (allocResponse.data as unknown as { items: LeaveAllocation[] })
              ?.items || [];
        // Filter allocations by selected year
        const filteredAllocs = allocs.filter(
          (alloc) => alloc.year === Number(yearFilter)
        );
        setAllocations(filteredAllocs);
      }
    } catch {
      toast.error("Failed to load allocations");
    }
  };

  const handleAutoAllocate = async () => {
    setIsAutoAllocating(true);
    setAllocationProgress({ current: 0, total: 0 });

    try {
      // First, get all active employees
      const empResponse = await employeeApi.getAllEmployees();
      const employees = Array.isArray(empResponse.data)
        ? empResponse.data
        : (empResponse.data as unknown as { items: Employee[] })?.items || [];

      const activeEmployees = employees.filter(
        (emp: Employee) => emp.employmentStatus === "Active"
      );

      if (activeEmployees.length === 0) {
        toast.error("No active employees found");
        return;
      }

      setAllocationProgress({ current: 0, total: activeEmployees.length });

      let successCount = 0;
      let failCount = 0;

      // Auto-allocate for each employee
      for (let i = 0; i < activeEmployees.length; i++) {
        const employee = activeEmployees[i];
        try {
          await leaveAllocationApi.autoAllocateToEmployee(
            employee.id,
            Number(yearFilter)
          );
          successCount++;
        } catch {
          failCount++;
        }
        setAllocationProgress({
          current: i + 1,
          total: activeEmployees.length,
        });
      }

      // Show results
      if (failCount === 0) {
        toast.success(
          `Successfully allocated leaves to ${successCount} employee(s)`
        );
      } else {
        toast.warning(
          `Allocated to ${successCount} employee(s), ${failCount} failed`
        );
      }

      // Refresh allocations for the selected year
      await loadAllocations();
    } catch {
      toast.error("Failed to auto-allocate leaves");
    } finally {
      setIsAutoAllocating(false);
      setAllocationProgress({ current: 0, total: 0 });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Leave Allocations"
          description="View and manage leave allocations for employees"
        />
      </div>

      <DataTable
        columns={columns}
        data={allocations}
        toolbar={
          <DataTableToolbar
            searchKey="employeeName"
            searchPlaceholder="Search employees..."
            filters={
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="h-8 w-full md:w-37.5">
                  <SelectValue placeholder="Filter by year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(
                    { length: 5 },
                    (_, i) => new Date().getFullYear() - 2 + i
                  ).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            }
            actions={
              isHR && (
                <AlertDialog>
                  <AlertDialogTrigger className="w-full md:w-auto" asChild>
                    <Button
                      className="h-8 w-full md:w-auto"
                      disabled={isAutoAllocating}
                    >
                      {isAutoAllocating ? "Allocating..." : "Auto-Allocate"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Auto-Allocate Leaves</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will allocate default leave days to all active
                        employees for {yearFilter}. Are you sure you want to
                        proceed?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    {isAutoAllocating && allocationProgress.total > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          Processing: {allocationProgress.current} /{" "}
                          {allocationProgress.total} employees
                        </p>
                        <Progress
                          value={
                            (allocationProgress.current /
                              allocationProgress.total) *
                            100
                          }
                        />
                      </div>
                    )}
                    <div className="flex justify-end gap-2">
                      <AlertDialogCancel disabled={isAutoAllocating}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleAutoAllocate}
                        disabled={isAutoAllocating}
                      >
                        {isAutoAllocating ? "Allocating..." : "Proceed"}
                      </AlertDialogAction>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
              )
            }
          />
        }
        pagination={<DataTablePagination />}
      />
    </div>
  );
}
