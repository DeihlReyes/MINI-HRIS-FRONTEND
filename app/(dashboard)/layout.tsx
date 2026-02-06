import type { Metadata } from "next";
import { DashboardLayout } from "@/components/layout";

export const metadata: Metadata = {
  title: "Dashboard - HRIS",
  description: "Human Resource Information System Dashboard",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
