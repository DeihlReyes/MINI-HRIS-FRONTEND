import {
  CreateDepartmentInput,
  Department,
  Employee,
  UpdateDepartmentInput,
} from "@/types";

import { apiClient } from "./client";

export const departmentApi = {
  // Get all departments
  async getAllDepartments() {
    return apiClient.get<Department[]>("/departments");
  },

  // Get department by ID
  async getDepartmentById(id: string) {
    return apiClient.get<Department>(`/departments/${id}`);
  },

  // Get department employees
  async getDepartmentEmployees(id: string) {
    return apiClient.get<Employee[]>(`/departments/${id}/employees`);
  },

  // Create department
  async createDepartment(data: CreateDepartmentInput) {
    return apiClient.post<Department>("/departments", data);
  },

  // Update department
  async updateDepartment(id: string, data: UpdateDepartmentInput) {
    return apiClient.put<Department>(`/departments/${id}`, data);
  },

  // Delete department
  async deleteDepartment(id: string) {
    return apiClient.delete<void>(`/departments/${id}`);
  },
};
