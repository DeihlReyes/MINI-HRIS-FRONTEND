"use client";

import { useEffect, useState } from "react";

import { RoleGuard } from "@/components/auth";
import { DepartmentList } from "@/components/departments/department-list";
import { departmentApi, employeeApi } from "@/lib/api";
import { Department, Employee } from "@/types";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [deptResponse, empResponse] = await Promise.all([
          departmentApi.getAllDepartments(),
          employeeApi.getAllEmployees(),
        ]);

        const deptData = deptResponse?.data || [];
        const empData = empResponse?.data || [];

        setDepartments(
          Array.isArray(deptData) ? deptData : [deptData as Department]
        );
        setEmployees(Array.isArray(empData) ? empData : [empData as Employee]);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <RoleGuard allowedRoles={["HR"]}>
      {isLoading ? (
        <div className="flex h-screen items-center justify-center">
          <p>Loading...</p>
        </div>
      ) : (
        <DepartmentList
          initialData={departments}
          initialEmployees={employees}
        />
      )}
    </RoleGuard>
  );
}
