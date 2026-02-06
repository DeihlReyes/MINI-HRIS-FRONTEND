import {
  CreateEmployeeInformationInput,
  EmployeeInformation,
  UpdateEmployeeInformationInput,
} from "@/types";

import { apiClient } from "./client";

export const employeeInformationApi = {
  // Get employee information by ID
  async getInformationById(id: string) {
    return apiClient.get<EmployeeInformation>(`/employeeinformation/${id}`);
  },

  // Get employee information by employee ID
  async getInformationByEmployeeId(employeeId: string) {
    return apiClient.get<EmployeeInformation>(
      `/employeeinformation/employee/${employeeId}`
    );
  },

  // Get all employee information records
  async getAllInformation() {
    return apiClient.get<EmployeeInformation[]>("/employeeinformation");
  },

  // Create employee information
  async createInformation(data: CreateEmployeeInformationInput) {
    return apiClient.post<EmployeeInformation>("/employeeinformation", data);
  },

  // Update employee information
  async updateInformation(id: string, data: UpdateEmployeeInformationInput) {
    return apiClient.put<EmployeeInformation>(
      `/employeeinformation/${id}`,
      data
    );
  },

  // Delete employee information
  async deleteInformation(id: string) {
    return apiClient.delete<void>(`/employeeinformation/${id}`);
  },
};
