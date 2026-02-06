import { z } from "zod";

export const leaveTypeFormSchema = z.object({
  name: z
    .string()
    .min(1, "Leave type name is required")
    .max(200, "Leave type name must be less than 200 characters"),
  code: z
    .string()
    .min(1, "Leave type code is required")
    .max(50, "Leave type code must be less than 50 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  defaultDays: z
    .number()
    .min(0, "Default days must be a positive number"),
  isPaid: z.boolean(),
  requiresApproval: z.boolean(),
  maxConsecutiveDays: z
    .number()
    .min(0, "Max consecutive days must be a positive number")
    .optional(),
  minNoticeDays: z
    .number()
    .min(0, "Min notice days must be a positive number")
    .optional(),
  isActive: z.boolean(),
});

export type LeaveTypeFormValues = z.infer<typeof leaveTypeFormSchema>;

export const leaveFormSchema = z.object({
  employeeId: z.string().min(1, "Employee is required"),
  leaveTypeId: z.string().min(1, "Leave type is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  reason: z
    .string()
    .min(1, "Reason is required")
    .max(500, "Reason must be less than 500 characters"),
});

export type LeaveFormValues = z.infer<typeof leaveFormSchema>;

export const leaveApprovalFormSchema = z.object({
  status: z.enum(["Approved", "Rejected"]),
  approverComments: z
    .string()
    .max(500, "Comments must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  rejectionReason: z
    .string()
    .max(500, "Rejection reason must be less than 500 characters")
    .optional()
    .or(z.literal("")),
});

export type LeaveApprovalFormValues = z.infer<typeof leaveApprovalFormSchema>;
