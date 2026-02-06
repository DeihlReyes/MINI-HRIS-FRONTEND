"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ArrowLeft } from "lucide-react";

import { RoleGuard } from "@/components/auth";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@/contexts/user-context";
import { employeeApi } from "@/lib/api";
import { Employee } from "@/types";

export default function ProfilePage() {
  const router = useRouter();
  const { role, employeeId } = useUser();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        if (role === "Employee" && employeeId) {
          // For Employee role, load the selected employee's data
          const response = await employeeApi.getEmployeeById(employeeId);
          if (response.data) {
            setEmployee(response.data);
          }
        } else if (role === "HR") {
          // For HR role, we could show a dummy profile or admin info
          setEmployee(null);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [role, employeeId]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={["HR", "Employee"]}>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <PageHeader
            title="My Profile"
            description="View and manage your profile information"
          />
        </div>

        {role === "HR" ? (
          // HR user profile
          <Card>
            <CardHeader>
              <CardTitle>Administrator Profile</CardTitle>
              <CardDescription>HR Admin Account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Role
                </label>
                <p className="mt-1 text-lg font-medium">Human Resources (HR)</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Permissions
                </label>
                <ul className="mt-2 space-y-1">
                  <li className="flex items-center gap-2 text-sm">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    View all employees
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    Manage departments
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    Manage leave requests
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    View leave allocations
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        ) : employee ? (
          // Employee user profile
          <>
            <Card>
              <CardHeader>
                <CardTitle>{`${employee.firstName} ${employee.lastName}`}</CardTitle>
                <CardDescription>{employee.position}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      Employee Number
                    </label>
                    <p className="mt-1">{employee.employeeNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      Email
                    </label>
                    <p className="mt-1">{employee.email}</p>
                  </div>
                  {employee.phone && (
                    <div>
                      <label className="text-sm font-semibold text-gray-600">
                        Phone
                      </label>
                      <p className="mt-1">{employee.phone}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      Department
                    </label>
                    <p className="mt-1">{employee.departmentName || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      Hire Date
                    </label>
                    <p className="mt-1">
                      {new Date(employee.hireDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      Status
                    </label>
                    <p className="mt-1">{employee.employmentStatus}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      Salary
                    </label>
                    <p className="mt-1">${employee.salary.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-600">
                No profile data available
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </RoleGuard>
  );
}
