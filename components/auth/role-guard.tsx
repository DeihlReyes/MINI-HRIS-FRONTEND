"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useUser } from "@/contexts/user-context";

type UserRole = "HR" | "Employee";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export function RoleGuard({
  children,
  allowedRoles,
  redirectTo = "/dashboard",
}: RoleGuardProps) {
  const { role } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!allowedRoles.includes(role)) {
      router.push(redirectTo);
    }
  }, [role, allowedRoles, redirectTo, router]);

  // Don't render children if user doesn't have access
  if (!allowedRoles.includes(role)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Access Denied</h2>
          <p className="mt-2 text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
