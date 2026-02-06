"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  LeaveTypeFormValues,
  leaveTypeFormSchema,
} from "@/lib/validations/leave";
import { LeaveType } from "@/types";

interface LeaveTypeFormProps {
  leaveType?: LeaveType;
  onSubmit: (data: LeaveTypeFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function LeaveTypeForm({
  leaveType,
  onSubmit,
  isLoading = false,
}: LeaveTypeFormProps) {
  const form = useForm<LeaveTypeFormValues>({
    resolver: zodResolver(leaveTypeFormSchema),
    defaultValues: {
      name: leaveType?.name || "",
      code: leaveType?.code || "",
      description: leaveType?.description || "",
      defaultDays: leaveType?.defaultDays || 0,
      isPaid: leaveType?.isPaid ?? true,
      requiresApproval: leaveType?.requiresApproval ?? true,
      maxConsecutiveDays: leaveType?.maxConsecutiveDays,
      minNoticeDays: leaveType?.minNoticeDays,
      isActive: leaveType?.isActive ?? true,
    },
  });

  const handleSubmit = async (data: LeaveTypeFormValues) => {
    try {
      await onSubmit(data);
      if (!leaveType) {
        form.reset();
        toast.success("Leave type created successfully");
      } else {
        toast.success("Leave type updated successfully");
      }
    } catch {
      toast.error("Failed to save leave type");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Leave Type Name</FormLabel>
              <FormControl>
                <Input placeholder="Annual Leave" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input placeholder="AL" {...field} disabled={!!leaveType} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Leave type description..."
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="defaultDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Days</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="20"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxConsecutiveDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Consecutive Days</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="10"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="minNoticeDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Min Notice Days</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="7"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-3">
          <FormField
            control={form.control}
            name="isPaid"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="mb-0">Is Paid</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="requiresApproval"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="mb-0">Requires Approval</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="mb-0">Is Active</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading
            ? "Saving..."
            : `${leaveType ? "Update" : "Create"} Leave Type`}
        </Button>
      </form>
    </Form>
  );
}
