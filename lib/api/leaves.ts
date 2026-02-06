import {
  ApprovalLeaveInput,
  CreateLeaveInput,
  Leave,
  UpdateLeaveInput,
} from "@/types";

import { apiClient } from "./client";

export const leaveApi = {
  // Get all leave requests
  async getAllLeaves() {
    return apiClient.get<Leave[]>("/leaves");
  },

  // Get leave by ID
  async getLeaveById(id: string) {
    return apiClient.get<Leave>(`/leaves/${id}`);
  },

  // Apply for leave
  async createLeave(data: CreateLeaveInput) {
    return apiClient.post<Leave>("/leaves", data);
  },

  // Update leave request (only pending leaves can be updated)
  async updateLeave(id: string, data: UpdateLeaveInput) {
    return apiClient.put<Leave>(`/leaves/${id}`, data);
  },

  // Delete leave request
  async deleteLeave(id: string) {
    return apiClient.delete<void>(`/leaves/${id}`);
  },

  // Get employee leaves
  async getEmployeeLeaves(employeeId: string) {
    return apiClient.get<Leave[]>(`/leaves/employee/${employeeId}`);
  },

  // Get leaves by status
  async getLeavesByStatus(
    status: "Pending" | "Approved" | "Rejected" | "Cancelled"
  ) {
    return apiClient.get<Leave[]>(`/leaves/status/${status}`);
  },

  // Approve or reject leave
  async approveLeave(id: string, data: ApprovalLeaveInput) {
    return apiClient.post<Leave>(`/leaves/${id}/approval`, data);
  },

  // Cancel leave request
  async cancelLeave(id: string, cancellationReason: string) {
    return apiClient.post<Leave>(`/leaves/${id}/cancel`, cancellationReason);
  },
};
