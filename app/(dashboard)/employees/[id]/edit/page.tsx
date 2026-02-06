import { RoleGuard } from "@/components/auth";
import { EmployeeFormPage } from "@/components/employees/employee-form-page";
import { employeeApi } from "@/lib/api";
import { Employee } from "@/types";

export const metadata = {
  title: "Edit Employee - HRIS",
  description: "Edit employee information",
};

export default async function EditEmployeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const response = await employeeApi.getEmployeeById(id);
  const employee = (response.data as Employee) || null;

  if (!employee) {
    return (
      <RoleGuard allowedRoles={["HR"]}>
        <div className="p-6 text-center text-red-600">Employee not found.</div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={["HR"]}>
      <EmployeeFormPage employee={employee} isEdit={true} />
    </RoleGuard>
  );
}
