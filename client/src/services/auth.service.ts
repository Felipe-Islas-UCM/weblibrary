import axiosInstance from "../lib/axios";
import type { User, UserRegistrationData } from "../types/user";

export interface LoginResponse {
  access: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<string> {
    try {
      const response = await axiosInstance.post<string>(
        `/auth/login`,
        credentials
      );
      if (response.data) {
        localStorage.setItem("accessToken", response.data);
      }
      return response.data;
    } catch (error: any) {
      if (error.response?.data === "El usuario está inactivo") {
        throw new Error("El usuario está inactivo");
      }
      throw error;
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await axiosInstance.get<User>(`/auth/current/`);
    return response.data;
  },

  logout(): void {
    localStorage.removeItem("accessToken");
    // Opcionalmente, limpiar cualquier otro dato de la sesión
  },

  async register(userData: UserRegistrationData): Promise<User> {
    const response = await axiosInstance.post<User>(
      `/auth/register`,
      userData
    );
    return response.data;
  },

  async register_admin(userData: UserRegistrationData): Promise<User> {
    const response = await axiosInstance.post<User>(
      `/auth/register-admin`,
      userData
    );
    return response.data;
  },
};
