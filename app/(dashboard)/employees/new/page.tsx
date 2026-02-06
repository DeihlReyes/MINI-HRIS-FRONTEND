"use client";

import { RoleGuard } from "@/components/auth";
import { EmployeeFormPage } from "@/components/employees/employee-form-page";

export default function AddEmployeePage() {
  return (
    <RoleGuard allowedRoles={["HR"]}>
      <EmployeeFormPage />
    </RoleGuard>
  );
}
