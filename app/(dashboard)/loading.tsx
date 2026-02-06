import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLayoutLoading() {
  return (
    <div className="animate-pulse">
      <div className="p-6">
        <Skeleton className="h-12 w-64" />
      </div>
    </div>
  );
}
