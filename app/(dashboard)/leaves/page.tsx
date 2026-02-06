"use client";

import { useEffect, useState } from "react";

import { RoleGuard } from "@/components/auth";
import { LeaveList } from "@/components/leaves/leave-list";
import { useUser } from "@/contexts/user-context";
import { leaveApi } from "@/lib/api";
import { Leave } from "@/types";

export default function LeavesPage() {
  const { role, employeeId } = useUser();
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaves() {
      setIsLoading(true);
      try {
        let response;

        // If Employee role and employee is selected, fetch only their leaves
        if (role === "Employee" && employeeId) {
          response = await leaveApi.getEmployeeLeaves(employeeId);
        } else {
          // HR role: fetch all leaves
          response = await leaveApi.getAllLeaves();
        }

        const data = response?.data || [];
        const leaveList = Array.isArray(data) ? data : [];
        setLeaves(leaveList);
      } catch (error) {
        console.error("Failed to fetch leaves:", error);
        setLeaves([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLeaves();
  }, [role, employeeId]);

  return (
    <RoleGuard allowedRoles={["HR", "Employee"]}>
      {isLoading ? (
        <div className="flex h-screen items-center justify-center">
          <p>Loading leave requests...</p>
        </div>
      ) : (
        <LeaveList
          initialData={leaves}
          userRole={role}
          userEmployeeId={employeeId || undefined}
        />
      )}
    </RoleGuard>
  );
}
