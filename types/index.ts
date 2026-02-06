// ============================================================================
// EMPLOYEE TYPES
// ============================================================================

export interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  salary: number;
  hireDate: string;
  employmentStatus: string;
  departmentId: string;
  departmentName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeInput {
  employeeNumber: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  salary: number;
  hireDate: string;
  departmentId: string;
  employmentStatus?: string;
}

export interface UpdateEmployeeInput {
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  salary: number;
  hireDate: string;
  departmentId: string;
  employmentStatus?: string;
}

// ============================================================================
// EMPLOYEE INFORMATION TYPES
// ============================================================================

export interface EmployeeInformation {
  id: string;
  employeeId: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phoneNumber: string;
  mobileNumber?: string;
  dateOfBirth: string;
  gender?: string;
  maritalStatus?: string;
  nationality?: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  ssn?: string;
  passportNumber?: string;
  taxId?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankRoutingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeInformationInput {
  employeeId: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phoneNumber: string;
  mobileNumber?: string;
  dateOfBirth: string;
  gender?: string;
  maritalStatus?: string;
  nationality?: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  ssn?: string;
  passportNumber?: string;
  taxId?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankRoutingNumber?: string;
}

export interface UpdateEmployeeInformationInput {
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phoneNumber: string;
  mobileNumber?: string;
  dateOfBirth: string;
  gender?: string;
  maritalStatus?: string;
  nationality?: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  ssn?: string;
  passportNumber?: string;
  taxId?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankRoutingNumber?: string;
}

// ============================================================================
// DEPARTMENT TYPES
// ============================================================================

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  managerId?: string;
  managerName?: string;
  isActive: boolean;
  employeeCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateDepartmentInput {
  name: string;
  code: string;
  description?: string;
  managerId?: string;
}

export interface UpdateDepartmentInput {
  name: string;
  code: string;
  description?: string;
  managerId?: string;
  isActive?: boolean;
}

// ============================================================================
// LEAVE TYPE TYPES
// ============================================================================

export interface LeaveType {
  id: string;
  name: string;
  code: string;
  description?: string;
  defaultDays: number;
  isPaid: boolean;
  requiresApproval: boolean;
  maxConsecutiveDays?: number;
  minNoticeDays?: number;
  isActive: boolean;
  gender?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateLeaveTypeInput {
  name: string;
  code: string;
  description?: string;
  defaultDays: number;
  isPaid?: boolean;
  requiresApproval?: boolean;
  maxConsecutiveDays?: number;
  minNoticeDays?: number;
  gender?: string;
}

export interface UpdateLeaveTypeInput {
  name: string;
  code: string;
  description?: string;
  defaultDays: number;
  isPaid?: boolean;
  requiresApproval?: boolean;
  maxConsecutiveDays?: number;
  minNoticeDays?: number;
  isActive?: boolean;
  gender?: string;
}

// ============================================================================
// LEAVE REQUEST TYPES
// ============================================================================

export interface Leave {
  id: string;
  employeeId: string;
  employeeName?: string;
  leaveTypeId: string;
  leaveTypeName?: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected" | "Cancelled";
  approvedBy?: string;
  approverName?: string;
  approvedAt?: string;
  approverComments?: string;
  rejectionReason?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  attachmentPath?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateLeaveInput {
  employeeId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  attachmentPath?: string;
}

export interface UpdateLeaveInput {
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  attachmentPath?: string;
}

export interface ApprovalLeaveInput {
  Status: "Approved" | "Rejected";
  Comments?: string;
  RejectionReason?: string;
}

// ============================================================================
// LEAVE ALLOCATION TYPES
// ============================================================================

export interface LeaveAllocation {
  id: string;
  employeeId: string;
  employeeName?: string;
  leaveTypeId: string;
  leaveTypeName?: string;
  leaveTypeCode?: string;
  allocatedDays: number;
  usedDays?: number;
  remainingDays?: number;
  year: number;
  isActive: boolean;
  expiryDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLeaveAllocationInput {
  employeeId: string;
  leaveTypeId: string;
  allocatedDays: number;
  year: number;
  expiryDate?: string;
  notes?: string;
}

export interface UpdateLeaveAllocationInput {
  allocatedDays: number;
  isActive?: boolean;
  expiryDate?: string;
  notes?: string;
}

export interface LeaveBalance {
  leaveTypeId: string;
  leaveTypeName: string;
  leaveTypeCode: string;
  allocatedDays: number;
  usedDays: number;
  remainingDays: number;
  pendingDays: number;
  isActive: boolean;
  expiryDate?: string;
}

export interface EmployeeLeaveBalanceSummary {
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  year: number;
  leaveBalances: LeaveBalance[];
  generatedAt: string;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// Pagination Query Params
export interface PaginationParams {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}
