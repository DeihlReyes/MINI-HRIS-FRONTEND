"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/contexts";
import { leaveApi } from "@/lib/api";
import {
  LeaveApprovalFormValues,
  leaveApprovalFormSchema,
} from "@/lib/validations/leave";
import { ApprovalLeaveInput, Leave } from "@/types";

interface LeaveDetailProps {
  leaveId: string;
  initialLeave: Leave;
}

export function LeaveDetail({ leaveId, initialLeave }: LeaveDetailProps) {
  const router = useRouter();
  const { role, employeeId: currentEmployeeId } = useUser();
  const isHR = role === "HR";
  const [leave, setLeave] = useState<Leave>(initialLeave);
  const [isProcessing, setIsProcessing] = useState(false);

  // Authorization check - Employees can only view their own leaves
  const isOwnLeave = currentEmployeeId === leave.employeeId;
  const isAuthorized = isHR || isOwnLeave;

  const form = useForm<LeaveApprovalFormValues>({
    resolver: zodResolver(leaveApprovalFormSchema),
    defaultValues: {
      status: "Approved",
      approverComments: "",
      rejectionReason: "",
    },
  });

  const handleApproval = async (data: LeaveApprovalFormValues) => {
    setIsProcessing(true);
    try {
      const payload: ApprovalLeaveInput = {
        Status: data.status,
        Comments: data.approverComments || undefined,
        RejectionReason: data.rejectionReason || undefined,
      };
      await leaveApi.approveLeave(leaveId, payload);
      toast.success(`Leave ${data.status.toLowerCase()} successfully`);
      // Update local state to reflect the change
      setLeave({
        ...leave,
        status: data.status,
        approverComments: data.approverComments,
        rejectionReason: data.rejectionReason,
      });
      router.push("/leaves");
    } catch {
      toast.error("Failed to process leave");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    setIsProcessing(true);
    try {
      await leaveApi.cancelLeave(leaveId, "Cancelled by employee");
      toast.success("Leave cancelled successfully");
      // Update local state to reflect the change
      setLeave({ ...leave, status: "Cancelled" });
      router.push("/leaves");
    } catch {
      toast.error("Failed to cancel leave");
    } finally {
      setIsProcessing(false);
    }
  };

  const statusColors: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    Pending: "outline",
    Approved: "default",
    Rejected: "destructive",
    Cancelled: "secondary",
  };

  const isPending = leave.status === "Pending";
  const isApproved = leave.status === "Approved";

  // If not authorized, show access denied message
  if (!isAuthorized) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600">
              You don&apos;t have permission to view this leave request.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Leave Request</h1>
            <div className="mt-2 flex gap-2">
              <Badge variant={statusColors[leave.status]}>{leave.status}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Leave Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-600">Employee</p>
            <p className="text-lg font-semibold">{leave.employeeName || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Leave Type</p>
            <p className="text-lg font-semibold">
              {leave.leaveTypeName || "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Start Date</p>
            <p className="text-lg font-semibold">
              {new Date(leave.startDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">End Date</p>
            <p className="text-lg font-semibold">
              {new Date(leave.endDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Days</p>
            <p className="text-lg font-semibold">{leave.totalDays} days</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Request Date</p>
            <p className="text-lg font-semibold">
              {new Date(leave.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-600">Reason</p>
            <p className="mt-2 rounded bg-gray-50 p-3 text-lg font-semibold">
              {leave.reason}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Approval Information */}
      {leave.status !== "Pending" && (
        <Card>
          <CardHeader>
            <CardTitle>Approval Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-600">Approved By</p>
              <p className="text-lg font-semibold">
                {leave.approverName || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Approval Date</p>
              <p className="text-lg font-semibold">
                {leave.approvedAt
                  ? new Date(leave.approvedAt).toLocaleDateString()
                  : "-"}
              </p>
            </div>
            {leave.approverComments && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600">Comments</p>
                <p className="mt-2 rounded bg-gray-50 p-3 text-lg font-semibold">
                  {leave.approverComments}
                </p>
              </div>
            )}
            {leave.rejectionReason && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600">Rejection Reason</p>
                <p className="mt-2 rounded bg-red-50 p-3 text-lg font-semibold text-red-700">
                  {leave.rejectionReason}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {/* Approval section - Only HR can approve/reject */}
      {isPending && isHR && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle>Approval Required</CardTitle>
            <CardDescription>
              Please review and approve or reject this leave request
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleApproval)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Decision</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Approved">Approve</SelectItem>
                          <SelectItem value="Rejected">Reject</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("status") === "Rejected" && (
                  <FormField
                    control={form.control}
                    name="rejectionReason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rejection Reason</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please provide a reason for rejection..."
                            className="resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="approverComments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comments (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any comments..."
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full"
                  variant={
                    form.watch("status") === "Rejected"
                      ? "destructive"
                      : "default"
                  }
                >
                  {isProcessing
                    ? "Processing..."
                    : form.watch("status") === "Rejected"
                      ? "Reject Leave"
                      : "Approve Leave"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Cancel button - HR can cancel any approved leave, employees can cancel their own */}
      {isApproved && (isHR || isOwnLeave) && (
        <div className="flex gap-2">
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={isProcessing}
            className="w-full"
          >
            {isProcessing ? "Processing..." : "Cancel Leave"}
          </Button>
        </div>
      )}
    </div>
  );
}
