import axios, { AxiosError, AxiosInstance } from "axios";
import https from "https";

import { ApiResponse } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7003/api";

// Create HTTPS agent that ignores self-signed certificates
// This is useful for development environments
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
      httpsAgent,
    });

    // Add request interceptor to include role and employee ID headers
    this.client.interceptors.request.use(
      (config) => {
        // Only access localStorage in browser environment
        if (typeof window !== "undefined") {
          // Get role and employee ID from localStorage
          const role = localStorage.getItem("demoRole") || "HR";
          const employeeId = localStorage.getItem("demoEmployeeId");

          // Add custom headers
          config.headers["X-User-Role"] = role;
          if (employeeId) {
            config.headers["X-User-Id"] = employeeId;
          }
        } else {
          // Default headers for server-side rendering
          config.headers["X-User-Role"] = "HR";
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add any interceptors here for auth tokens, etc.
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        // Handle global error responses
        if (error.response?.status === 401) {
          // Handle unauthorized - redirect to login when auth is implemented
          console.error("Unauthorized access");
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, params?: Record<string, unknown>) {
    try {
      const response = await this.client.get<ApiResponse<T> | T>(url, {
        params,
      });
      return this.normalizeResponse<T>(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post<T>(url: string, data?: unknown) {
    try {
      const response = await this.client.post<ApiResponse<T> | T>(url, data);
      return this.normalizeResponse<T>(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put<T>(url: string, data?: unknown) {
    try {
      const response = await this.client.put<ApiResponse<T> | T>(url, data);
      return this.normalizeResponse<T>(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete<T>(url: string) {
    try {
      const response = await this.client.delete<ApiResponse<T> | T>(url);
      return this.normalizeResponse<T>(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private normalizeResponse<T>(payload: ApiResponse<T> | T): ApiResponse<T> {
    if (payload && typeof payload === "object") {
      const maybeEnvelope = payload as ApiResponse<T>;
      if (
        "data" in maybeEnvelope ||
        "success" in maybeEnvelope ||
        "message" in maybeEnvelope ||
        "errors" in maybeEnvelope
      ) {
        return {
          success: maybeEnvelope.success ?? true,
          message: maybeEnvelope.message ?? "",
          data: maybeEnvelope.data,
          errors: maybeEnvelope.errors,
        };
      }
    }

    return {
      success: true,
      message: "",
      data: payload as T,
    };
  }

  private handleError(error: unknown) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || error.message || "An error occurred";
      const errors = error.response?.data?.errors;

      return {
        message,
        errors,
        status: error.response?.status,
      };
    }
    return error;
  }
}

export const apiClient = new ApiClient();
