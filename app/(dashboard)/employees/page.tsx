"use client";

import { useEffect, useState } from "react";

import { RoleGuard } from "@/components/auth";
import { EmployeeList } from "@/components/employees/employee-list";
import { employeeApi } from "@/lib/api";
import { Employee } from "@/types";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const response = await employeeApi.getAllEmployees();
        const data = response?.data || [];
        const employeeList = Array.isArray(data)
          ? data
          : (data as { items: Employee[] }).items || [];
        setEmployees(employeeList);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEmployees();
  }, []);

  return (
    <RoleGuard allowedRoles={["HR"]}>
      {isLoading ? (
        <div className="flex h-screen items-center justify-center">
          <p>Loading...</p>
        </div>
      ) : (
        <EmployeeList initialData={employees} />
      )}
    </RoleGuard>
  );
}
