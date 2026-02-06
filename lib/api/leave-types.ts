import { CreateLeaveTypeInput, LeaveType, UpdateLeaveTypeInput } from "@/types";

import { apiClient } from "./client";

export const leaveTypeApi = {
  // Get all leave types
  async getAllLeaveTypes() {
    return apiClient.get<LeaveType[]>("/leavetypes");
  },

  // Get leave type by ID
  async getLeaveTypeById(id: string) {
    return apiClient.get<LeaveType>(`/leavetypes/${id}`);
  },

  // Get active leave types only
  async getActiveLeaveTypes() {
    return apiClient.get<LeaveType[]>("/leavetypes/active");
  },

  // Create leave type
  async createLeaveType(data: CreateLeaveTypeInput) {
    return apiClient.post<LeaveType>("/leavetypes", data);
  },

  // Update leave type
  async updateLeaveType(id: string, data: UpdateLeaveTypeInput) {
    return apiClient.put<LeaveType>(`/leavetypes/${id}`, data);
  },

  // Delete leave type
  async deleteLeaveType(id: string) {
    return apiClient.delete<void>(`/leavetypes/${id}`);
  },
};
