// contexts/user-context.tsx
"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { employeeApi } from "@/lib/api";
import { Employee } from "@/types";

type UserRole = "HR" | "Employee";

interface UserContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  employeeId: string | null;
  setEmployeeId: (id: string | null) => void;
  employees: Employee[];
  loadingEmployees: boolean;
  refreshEmployees: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>("HR");
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem("demoRole") as UserRole | null;
    const savedEmployeeId = localStorage.getItem("demoEmployeeId");

    if (savedRole && ["HR", "Employee"].includes(savedRole)) {
      setRole(savedRole);
    }

    if (savedEmployeeId) {
      setEmployeeId(savedEmployeeId);
    }
  }, []);

  // Persist role and employeeId to localStorage when they change
  useEffect(() => {
    localStorage.setItem("demoRole", role);
  }, [role]);

  useEffect(() => {
    if (employeeId) {
      localStorage.setItem("demoEmployeeId", employeeId);
    } else {
      localStorage.removeItem("demoEmployeeId");
    }
  }, [employeeId]);

  // Load employees when role changes to Employee
  useEffect(() => {
    if (role === "Employee") {
      loadEmployees();
    } else {
      // Clear employee data when switching to HR
      setEmployeeId(null);
      setEmployees([]);
    }
  }, [role]);

  const loadEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const response = await employeeApi.getAllEmployees();
      if (response.data) {
        const emps = Array.isArray(response.data)
          ? response.data
          : (response.data as { items: Employee[] }).items || [];
        setEmployees(emps);

        // Auto-select first employee
        if (emps.length > 0) {
          setEmployeeId(emps[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to load employees:", error);
      setEmployees([]);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const refreshEmployees = async () => {
    if (role === "Employee") {
      await loadEmployees();
    }
  };

  return (
    <UserContext.Provider
      value={{
        role,
        setRole,
        employeeId,
        setEmployeeId,
        employees,
        loadingEmployees,
        refreshEmployees,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
