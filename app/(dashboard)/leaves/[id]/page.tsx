import { LeaveDetail } from "@/components/leaves/leave-detail";
import { leaveApi } from "@/lib/api";

export const metadata = {
  title: "Leave Details - HRIS",
  description: "View leave request details",
};

export default async function LeaveDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch leave data on the server
  // Note: Authorization is handled by the backend API and client-side component
  const response = await leaveApi.getLeaveById(id);
  const leave = response.data;

  if (!leave) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Leave not found</h1>
      </div>
    );
  }

  return <LeaveDetail leaveId={id} initialLeave={leave} />;
}
