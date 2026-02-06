import { RoleGuard } from "@/components/auth";
import { EmployeeDetail } from "@/components/employees/employee-detail";
import { employeeApi, leaveAllocationApi } from "@/lib/api";
import { Employee } from "@/types";

export default async function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [employeeResponse, balanceResponse] = await Promise.all([
    employeeApi.getEmployeeById(id),
    leaveAllocationApi.getEmployeeAllocations(id),
  ]);

  const employee = (employeeResponse.data as Employee) || null;
  const leaveBalance = balanceResponse.data || [];

  if (!employee) {
    return (
      <div className="p-6 text-center text-red-600">Employee not found.</div>
    );
  }

  return (
    <RoleGuard allowedRoles={["HR"]}>
      <EmployeeDetail
        employeeId={id}
        initialEmployee={employee}
        initialLeaveBalance={leaveBalance}
      />
    </RoleGuard>
  );
}
