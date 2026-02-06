"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ArrowLeft, Edit, Trash2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { employeeApi } from "@/lib/api";
import { Employee, LeaveAllocation } from "@/types";

import PageHeader from "../layout/page-header";
import { ScrollArea } from "../ui/scroll-area";

interface EmployeeDetailProps {
  employeeId: string;
  initialEmployee: Employee | null;
  initialLeaveBalance: LeaveAllocation[];
}

export function EmployeeDetail({
  employeeId,
  initialEmployee,
  initialLeaveBalance,
}: EmployeeDetailProps) {
  const router = useRouter();
  const [employee] = useState<Employee | null>(initialEmployee);
  const [leaveBalance] = useState<LeaveAllocation[]>(initialLeaveBalance);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await employeeApi.deleteEmployee(employeeId);
      toast.success("Employee deleted successfully");
      router.push("/employees");
    } catch {
      toast.error("Failed to delete employee");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!employee) {
    return <div className="p-6">Employee not found</div>;
  }

  const statusColors: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    Active: "default",
    Inactive: "secondary",
    OnLeave: "outline",
    Terminated: "destructive",
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <PageHeader
            title={`${employee.firstName} ${employee.lastName}`}
            description={`Employee #${employee.employeeNumber} - ${employee.position}`}
          />
        </div>
        <div className="flex gap-2">
          <Link href={`/employees/${employee.id}/edit`}>
            <Button className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this employee? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex justify-end gap-2">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Basic Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-600">Employee Number</p>
            <p className="text-lg font-semibold">{employee.employeeNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <Badge
              variant={statusColors[employee.employmentStatus]}
              className="mt-1"
            >
              {employee.employmentStatus}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="text-lg font-semibold">{employee.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Phone</p>
            <p className="text-lg font-semibold">{employee.phone || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Department</p>
            <p className="text-lg font-semibold">
              {employee.departmentName || "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Salary</p>
            <p className="text-lg font-semibold">
              ${employee.salary.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Hire Date</p>
            <p className="text-lg font-semibold">
              {new Date(employee.hireDate).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Leave Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle>Leave Balance</CardTitle>
          <CardDescription>Available leave for this employee</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-75">
            {leaveBalance.length === 0 ? (
              <p className="text-gray-500">No leave allocations found</p>
            ) : (
              <div className="space-y-4">
                {leaveBalance.map((allocation) => (
                  <div
                    key={allocation.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <p className="font-semibold">
                        {allocation.leaveTypeName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Year {allocation.year}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {allocation.usedDays} / {allocation.allocatedDays} days
                        used
                      </p>
                      <p className="text-lg font-semibold text-green-600">
                        {allocation.remainingDays} remaining
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
