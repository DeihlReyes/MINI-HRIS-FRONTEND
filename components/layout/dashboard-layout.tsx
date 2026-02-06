"use client";

import { UserProvider } from "@/contexts/user-context";

import { Header } from "./header";
import { Sidebar } from "./sidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <div className="flex min-h-screen flex-col md:flex-row">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
        </div>
      </div>
    </UserProvider>
  );
}
