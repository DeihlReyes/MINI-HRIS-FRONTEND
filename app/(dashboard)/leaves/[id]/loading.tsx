import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LeaveDetailLoading() {
  return (
    <div className="space-y-6 p-6">
      {/* Header with back button and title */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" disabled>
          <div className="h-4 w-4" />
        </Button>
        <div className="flex-1 space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>
      </div>

      {/* Leave Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Leave Request Details</CardTitle>
          <CardDescription>Request information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Two column layout */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-32" />
              </div>
            ))}
          </div>

          {/* Remarks */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Approval Form Card (if HR) */}
      <Card>
        <CardHeader>
          <CardTitle>Approval</CardTitle>
          <CardDescription>Manage leave request approval</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Select */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Comments */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-24 w-full" />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
