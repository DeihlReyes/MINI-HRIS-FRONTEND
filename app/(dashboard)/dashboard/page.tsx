import Link from "next/link";

import { Briefcase, Calendar, Clock, Users } from "lucide-react";

import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { departmentApi, employeeApi, leaveApi, leaveTypeApi } from "@/lib/api";

type DashboardStats = {
  employees: number;
  departments: number;
  pendingLeaves: number;
  leaveTypes: number;
};

async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const [
      employeesResponse,
      departmentsResponse,
      pendingLeavesResponse,
      leaveTypesResponse,
    ] = await Promise.all([
      employeeApi.getAllEmployees(),
      departmentApi.getAllDepartments(),
      leaveApi.getLeavesByStatus("Pending"),
      leaveTypeApi.getAllLeaveTypes(),
    ]);

    return {
      employees: Array.isArray(employeesResponse?.data)
        ? employeesResponse.data.length
        : 0,
      departments: Array.isArray(departmentsResponse?.data)
        ? departmentsResponse.data.length
        : 0,
      pendingLeaves: Array.isArray(pendingLeavesResponse?.data)
        ? pendingLeavesResponse.data.length
        : 0,
      leaveTypes: Array.isArray(leaveTypesResponse?.data)
        ? leaveTypesResponse.data.length
        : 0,
    };
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return {
      employees: 0,
      departments: 0,
      pendingLeaves: 0,
      leaveTypes: 0,
    };
  }
}

export const metadata = {
  title: "Dashboard - HRIS",
  description: "HRIS Dashboard",
};

export default async function DashboardPage() {
  const stats = await fetchDashboardStats();

  return (
    <div className="space-y-8 p-6">
      <PageHeader
        title="Dashboard"
        description="Overview of key metrics and quick access to common actions"
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Employees"
          value={stats.employees.toString()}
          description="Active employees"
          icon={<Users className="h-8 w-8 text-blue-500" />}
          href="/employees"
        />
        <StatCard
          title="Departments"
          value={stats.departments.toString()}
          description="Active departments"
          icon={<Briefcase className="h-8 w-8 text-green-500" />}
          href="/departments"
        />
        <StatCard
          title="Pending Leaves"
          value={stats.pendingLeaves.toString()}
          description="Awaiting approval"
          icon={<Calendar className="h-8 w-8 text-orange-500" />}
          href="/leaves"
        />
        <StatCard
          title="Leave Types"
          value={stats.leaveTypes.toString()}
          description="Available types"
          icon={<Clock className="h-8 w-8 text-purple-500" />}
          href="/leave-types"
        />
      </div>

      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/employees/new">
            <Button>Add Employee</Button>
          </Link>
          <Link href="/leaves/new">
            <Button variant="outline">Apply for Leave</Button>
          </Link>
          <Link href="/departments">
            <Button variant="outline">Manage Departments</Button>
          </Link>
          <Link href="/leave-allocations">
            <Button variant="outline">Leave Allocations</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
  href,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="cursor-pointer transition-shadow hover:shadow-lg">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">{title}</p>
              <p className="mt-2 text-2xl font-bold">{value}</p>
              <p className="mt-1 text-xs text-gray-500">{description}</p>
            </div>
            <div className="opacity-80">{icon}</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
