"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { toast } from "sonner";

import { EmployeeForm } from "@/components/forms/employee-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { departmentApi, employeeApi } from "@/lib/api";
import { EmployeeFormValues } from "@/lib/validations/employee";
import { Department, Employee } from "@/types";

interface EmployeeFormPageProps {
  employee?: Employee;
  isEdit?: boolean;
}

export function EmployeeFormPage({
  employee,
  isEdit = false,
}: EmployeeFormPageProps) {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDepts, setIsLoadingDepts] = useState(true);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const response = await departmentApi.getAllDepartments();
        if (response.data) {
          const depts = Array.isArray(response.data)
            ? response.data
            : (response.data as { items: Department[] }).items || [];
          setDepartments(depts);
        }
      } catch {
        toast.error("Failed to load departments");
      } finally {
        setIsLoadingDepts(false);
      }
    };

    loadDepartments();
  }, []);

  const handleSubmit = async (data: EmployeeFormValues) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        name: `${data.firstName} ${data.lastName}`,
      };
      if (isEdit && employee) {
        await employeeApi.updateEmployee(employee.id, payload);
      } else {
        await employeeApi.createEmployee(payload);
      }
      router.push("/employees");
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingDepts) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? "Edit Employee" : "Add New Employee"}</CardTitle>
          <CardDescription>
            {isEdit
              ? "Update employee information"
              : "Fill in the details to create a new employee"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmployeeForm
            employee={employee}
            departments={departments}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
