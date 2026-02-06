"use client";

import { useEffect, useState } from "react";

import { RoleGuard } from "@/components/auth";
import { LeaveAllocationList } from "@/components/leaves/leave-allocation-list";
import { leaveAllocationApi } from "@/lib/api";
import { LeaveAllocation } from "@/types";

export default function LeaveAllocationsPage() {
  const [allocations, setAllocations] = useState<LeaveAllocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaveAllocations() {
      try {
        const response = await leaveAllocationApi.getAllAllocations();
        const data = response?.data || [];
        setAllocations(
          Array.isArray(data)
            ? data
            : (data as { items: LeaveAllocation[] }).items || []
        );
      } catch (error) {
        console.error("Failed to fetch leave allocations:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLeaveAllocations();
  }, []);

  return (
    <RoleGuard allowedRoles={["HR"]}>
      {isLoading ? (
        <div className="flex h-screen items-center justify-center">
          <p>Loading...</p>
        </div>
      ) : (
        <LeaveAllocationList initialData={allocations} />
      )}
    </RoleGuard>
  );
}
