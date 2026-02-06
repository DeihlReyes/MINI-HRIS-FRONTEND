import { z } from "zod";

export const employeeFormSchema = z.object({
  employeeNumber: z
    .string()
    .min(1, "Employee number is required")
    .max(50, "Employee number must be less than 50 characters"),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name must be less than 100 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name must be less than 100 characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z
    .string()
    .max(20, "Phone must be less than 20 characters")
    .optional()
    .or(z.literal("")),
  position: z
    .string()
    .min(1, "Position is required")
    .max(100, "Position must be less than 100 characters"),
  salary: z
    .number()
    .min(0, "Salary must be a positive number"),
  hireDate: z
    .string()
    .min(1, "Hire date is required"),
  employmentStatus: z.enum(["Active", "Inactive", "OnLeave", "Terminated"]),
  departmentId: z.string().min(1, "Department is required"),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

export const employeeInformationFormSchema = z.object({
  employeeId: z.string().min(1, "Employee is required"),
  dateOfBirth: z.string().optional().or(z.literal("")),
  gender: z.string().optional().or(z.literal("")),
  maritalStatus: z.string().optional().or(z.literal("")),
  address: z
    .string()
    .max(500, "Address must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  city: z
    .string()
    .max(100, "City must be less than 100 characters")
    .optional()
    .or(z.literal("")),
  state: z
    .string()
    .max(100, "State must be less than 100 characters")
    .optional()
    .or(z.literal("")),
  postalCode: z
    .string()
    .max(20, "Postal code must be less than 20 characters")
    .optional()
    .or(z.literal("")),
  country: z
    .string()
    .max(100, "Country must be less than 100 characters")
    .optional()
    .or(z.literal("")),
  emergencyContactName: z
    .string()
    .max(200, "Emergency contact name must be less than 200 characters")
    .optional()
    .or(z.literal("")),
  emergencyContactPhone: z
    .string()
    .max(20, "Emergency contact phone must be less than 20 characters")
    .optional()
    .or(z.literal("")),
});

export type EmployeeInformationFormValues = z.infer<
  typeof employeeInformationFormSchema
>;
