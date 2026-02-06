import { CreateEmployeeInput, Employee, UpdateEmployeeInput } from "@/types";

import { apiClient } from "./client";

export const employeeApi = {
  // Get all employees
  async getAllEmployees() {
    return apiClient.get<Employee[]>("/employees");
  },

  // Get employee by ID
  async getEmployeeById(id: string) {
    return apiClient.get<Employee>(`/employees/${id}`);
  },

  // Create new employee
  async createEmployee(data: CreateEmployeeInput) {
    return apiClient.post<Employee>("/employees", data);
  },

  // Update employee
  async updateEmployee(id: string, data: UpdateEmployeeInput) {
    return apiClient.put<Employee>(`/employees/${id}`, data);
  },

  // Delete employee
  async deleteEmployee(id: string) {
    return apiClient.delete<void>(`/employees/${id}`);
  },

  // Search employees by term
  async searchEmployees(term: string) {
    return apiClient.get<Employee[]>("/employees/search", { term });
  },
};
