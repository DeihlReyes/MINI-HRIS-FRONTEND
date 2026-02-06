import { z } from "zod";

export const departmentFormSchema = z.object({
  name: z
    .string()
    .min(1, "Department name is required")
    .max(200, "Department name must be less than 200 characters"),
  code: z
    .string()
    .min(1, "Department code is required")
    .max(50, "Department code must be less than 50 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  managerId: z.string().optional().or(z.literal("")),
  isActive: z.boolean(),
});

export type DepartmentFormValues = z.infer<typeof departmentFormSchema>;
