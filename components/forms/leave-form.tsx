"use client";

import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/contexts";
import { leaveAllocationApi } from "@/lib/api";
import { LeaveFormValues, leaveFormSchema } from "@/lib/validations/leave";
import { Employee, LeaveAllocation, LeaveType } from "@/types";

interface LeaveFormProps {
  employees: Employee[];
  leaveTypes: LeaveType[];
  onSubmit: (data: LeaveFormValues & { totalDays: number }) => Promise<void>;
  isLoading?: boolean;
}

export function LeaveForm({
  employees,
  leaveTypes,
  onSubmit,
  isLoading = false,
}: LeaveFormProps) {
  const { role, employeeId: currentEmployeeId } = useUser();
  const isEmployee = role === "Employee";

  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveFormSchema),
    defaultValues: {
      employeeId:
        isEmployee && currentEmployeeId
          ? currentEmployeeId
          : (undefined as unknown as string),
      leaveTypeId: undefined as unknown as string,
      startDate: "",
      endDate: "",
      reason: "",
    },
  });

  const [leaveBalance, setLeaveBalance] = useState<LeaveAllocation | null>(
    null
  );
  const [loadingBalance, setLoadingBalance] = useState(false);
  const employeeId = form.watch("employeeId");
  const leaveTypeId = form.watch("leaveTypeId");
  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");

  // Auto-set employeeId for Employee role users
  useEffect(() => {
    if (isEmployee && currentEmployeeId) {
      form.setValue("employeeId", currentEmployeeId);
    }
  }, [isEmployee, currentEmployeeId, form]);

  // Calculate days and load balance
  useEffect(() => {
    if (employeeId && leaveTypeId) {
      loadBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId, leaveTypeId]);

  const loadBalance = async () => {
    setLoadingBalance(true);
    try {
      const response =
        await leaveAllocationApi.getEmployeeAllocations(employeeId);
      if (response.data) {
        const allocations = Array.isArray(response.data)
          ? response.data
          : (response.data as { items?: LeaveAllocation[] }).items || [];
        const balance = allocations.find(
          (b: LeaveAllocation) => b.leaveTypeId === leaveTypeId
        );
        setLeaveBalance(balance || null);
      }
    } catch {
      console.error("Failed to load balance");
    } finally {
      setLoadingBalance(false);
    }
  };

  const calculateDays = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  const totalDays = calculateDays();

  const handleSubmit = async (data: LeaveFormValues) => {
    if (
      leaveBalance &&
      leaveBalance.remainingDays &&
      totalDays > leaveBalance.remainingDays
    ) {
      toast.error(
        `Insufficient leave balance. You have ${leaveBalance.remainingDays} days available.`
      );
      return;
    }

    try {
      // Create a payload with totalDays included
      const payload = {
        ...data,
        totalDays,
      };
      await onSubmit(payload);
      form.reset();
      toast.success("Leave request submitted successfully");
    } catch {
      toast.error("Failed to submit leave request");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Employee Selection - Only show for HR role */}
        {!isEmployee && (
          <FormField
            control={form.control}
            name="employeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an employee" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName} ({emp.employeeNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Leave Type Selection */}
        <FormField
          control={form.control}
          name="leaveTypeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Leave Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {leaveTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Leave Balance */}
        {leaveBalance && employeeId && leaveTypeId && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex justify-between">
                    <p className="text-sm font-medium">Available Balance</p>
                    <p className="text-sm font-bold text-blue-600">
                      {leaveBalance.remainingDays || 0} /{" "}
                      {leaveBalance.allocatedDays || 0} days
                    </p>
                  </div>
                  <Progress
                    value={
                      leaveBalance.remainingDays && leaveBalance.allocatedDays
                        ? (leaveBalance.remainingDays /
                            leaveBalance.allocatedDays) *
                          100
                        : 0
                    }
                    className="h-2"
                  />
                </div>
                <p className="text-xs text-gray-600">
                  Already used: {leaveBalance.usedDays || 0} days
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dates */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Total Days */}
        {totalDays > 0 && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <p className="text-center">
                <span className="text-sm text-gray-600">
                  Total Leave Days:{" "}
                </span>
                <span className="text-lg font-bold text-green-600">
                  {totalDays} days
                </span>
              </p>
            </CardContent>
          </Card>
        )}

        {/* Reason */}
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason for Leave</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter the reason for your leave..."
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading || loadingBalance}
          className="w-full"
        >
          {isLoading ? "Submitting..." : "Submit Leave Request"}
        </Button>
      </form>
    </Form>
  );
}
