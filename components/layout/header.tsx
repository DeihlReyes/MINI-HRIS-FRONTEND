"use client";

import Link from "next/link";

import { User } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/contexts/user-context";

export function Header() {
  const {
    role,
    setRole,
    employeeId,
    setEmployeeId,
    employees,
    loadingEmployees,
  } = useUser();

  const handleRoleChange = (value: "HR" | "Employee") => {
    setRole(value);
  };

  const selectedEmployee = employees.find((emp) => emp.id === employeeId);

  return (
    <header className="sticky top-0 z-30 hidden w-full border-b bg-white md:block">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          {/* Role Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">Role:</span>
            <Select value={role} onValueChange={handleRoleChange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="Employee">Employee</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Employee Selector (only shows when role is Employee) */}
          {role === "Employee" && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">
                Employee:
              </span>
              <Select
                value={employeeId || undefined}
                onValueChange={setEmployeeId}
                disabled={loadingEmployees || employees.length === 0}
              >
                <SelectTrigger className="w-48">
                  <SelectValue
                    placeholder={
                      loadingEmployees ? "Loading..." : "Select employee"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name || `${emp.firstName} ${emp.lastName}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-10 w-10 cursor-pointer">
              <AvatarFallback>
                {role === "HR"
                  ? "HR"
                  : selectedEmployee
                    ? `${selectedEmployee.firstName[0]}${selectedEmployee.lastName[0]}`
                    : "U"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {role === "HR" ? "HR User" : selectedEmployee?.name || "User"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/profile">
              <DropdownMenuItem className="cursor-pointer gap-2">
                <User className="h-4 w-4" />
                Profile
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
