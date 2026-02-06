"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  Briefcase,
  Calendar,
  Clock,
  LayoutDashboard,
  Menu,
  Users,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/user-context";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["HR", "Employee"],
  },
  { name: "Employees", href: "/employees", icon: Users, roles: ["HR"] },
  {
    name: "Leaves",
    href: "/leaves",
    icon: Calendar,
    roles: ["HR", "Employee"],
  },
  { name: "Departments", href: "/departments", icon: Briefcase, roles: ["HR"] },
  { name: "Leave Types", href: "/leave-types", icon: Clock, roles: ["HR"] },
  {
    name: "Leave Allocations",
    href: "/leave-allocations",
    icon: Clock,
    roles: ["HR"],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { role } = useUser();

  // Filter navigation based on user role
  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(role)
  );

  return (
    <>
      {/* Mobile menu button */}
      <div className="sticky top-0 z-40 flex items-center gap-2 border-b bg-white p-4 md:hidden">
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </Button>
        <h1 className="text-lg font-bold text-blue-600">HRIS</h1>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r bg-white transition-all duration-200 md:static md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="hidden items-center gap-2 border-b p-6 md:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
              H
            </div>
            <h1 className="text-xl font-bold">HRIS</h1>
          </div>

          {/* Role Badge */}
          <div className="border-b px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">
                Current Role
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-1 text-xs font-semibold",
                  role === "HR"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                )}
              >
                {role}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-4">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className="w-full justify-start gap-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
