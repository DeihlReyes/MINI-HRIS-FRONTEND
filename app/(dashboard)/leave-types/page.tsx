"use client";

import { useEffect, useState } from "react";

import { RoleGuard } from "@/components/auth";
import { LeaveTypeList } from "@/components/leaves/leave-type-list";
import { leaveTypeApi } from "@/lib/api";
import { LeaveType } from "@/types";

export default function LeaveTypesPage() {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaveTypes() {
      try {
        const response = await leaveTypeApi.getAllLeaveTypes();
        const data = response?.data || [];
        setLeaveTypes(
          Array.isArray(data)
            ? data
            : (data as { items: LeaveType[] }).items || []
        );
      } catch (error) {
        console.error("Failed to fetch leave types:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLeaveTypes();
  }, []);

  return (
    <RoleGuard allowedRoles={["HR"]}>
      {isLoading ? (
        <div className="flex h-screen items-center justify-center">
          <p>Loading...</p>
        </div>
      ) : (
        <LeaveTypeList initialData={leaveTypes} />
      )}
    </RoleGuard>
  );
}
