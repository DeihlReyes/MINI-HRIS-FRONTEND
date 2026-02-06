"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { toast } from "sonner";

import { LeaveForm } from "@/components/forms/leave-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@/contexts";
import { employeeApi, leaveApi, leaveTypeApi } from "@/lib/api";
import { LeaveFormValues } from "@/lib/validations/leave";
import { Employee, LeaveType } from "@/types";

export function LeaveFormPage() {
  const router = useRouter();
  const { role } = useUser();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const loadData = async () => {
    try {
      const empPromise =
        role === "HR"
          ? employeeApi.getAllEmployees()
          : Promise.resolve({ data: [] });
      const typesPromise = leaveTypeApi.getAllLeaveTypes();

      const [empResponse, typesResponse] = await Promise.all([
        empPromise,
        typesPromise,
      ]);

      // Handle employees data
      if (empResponse.data && role === "HR") {
        const emps: Employee[] = Array.isArray(empResponse.data)
          ? empResponse.data
          : (empResponse.data as { items: Employee[] }).items || [];
        setEmployees(emps);
      }

      // Handle leave types data
      if (typesResponse.data) {
        const types: LeaveType[] = Array.isArray(typesResponse.data)
          ? typesResponse.data
          : (typesResponse.data as { items: LeaveType[] }).items || [];
        setLeaveTypes(types.filter((t: LeaveType) => t.isActive));
      }
    } catch {
      toast.error("Failed to load form data");
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSubmit = async (
    data: LeaveFormValues & { totalDays: number }
  ) => {
    setIsLoading(true);
    try {
      await leaveApi.createLeave({
        employeeId: data.employeeId,
        leaveTypeId: data.leaveTypeId,
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason,
        totalDays: data.totalDays,
      });
      router.push("/leaves");
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Apply for Leave</CardTitle>
          <CardDescription>
            {role === "Employee"
              ? "Submit your leave request with dates and reason"
              : "Submit a new leave request for an employee with leave dates and reason"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LeaveForm
            employees={employees}
            leaveTypes={leaveTypes}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
