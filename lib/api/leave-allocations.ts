import {
  CreateLeaveAllocationInput,
  EmployeeLeaveBalanceSummary,
  LeaveAllocation,
  UpdateLeaveAllocationInput,
} from "@/types";

import { apiClient } from "./client";

export const leaveAllocationApi = {
  // Get all leave allocations
  async getAllAllocations() {
    return apiClient.get<LeaveAllocation[]>("/leaveallocations");
  },

  // Get leave allocation by ID
  async getAllocationById(id: string) {
    return apiClient.get<LeaveAllocation>(`/leaveallocations/${id}`);
  },

  // Create leave allocation
  async createAllocation(data: CreateLeaveAllocationInput) {
    return apiClient.post<LeaveAllocation>("/leaveallocations", data);
  },

  // Update leave allocation
  async updateAllocation(id: string, data: UpdateLeaveAllocationInput) {
    return apiClient.put<LeaveAllocation>(`/leaveallocations/${id}`, data);
  },

  // Delete leave allocation
  async deleteAllocation(id: string) {
    return apiClient.delete<void>(`/leaveallocations/${id}`);
  },

  // Get employee leave allocations
  async getEmployeeAllocations(employeeId: string, year?: number) {
    const params: Record<string, unknown> = {};
    if (year) params.year = year;
    return apiClient.get<LeaveAllocation[]>(
      `/leaveallocations/employee/${employeeId}`,
      params
    );
  },

  // Get employee leave balance summary
  async getEmployeeBalanceSummary(employeeId: string, year: number) {
    return apiClient.get<EmployeeLeaveBalanceSummary>(
      `/leaveallocations/employee/${employeeId}/balance/${year}`
    );
  },

  // Auto-allocate leave types to employee for a year
  async autoAllocateToEmployee(employeeId: string, year: number) {
    return apiClient.post<{ message: string }>(
      `/leaveallocations/employee/${employeeId}/auto-allocate/${year}`,
      {}
    );
  },
};
