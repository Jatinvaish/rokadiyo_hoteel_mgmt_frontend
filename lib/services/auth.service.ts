import { apiClient } from "../api/client";
import { API_ENDPOINTS } from "../api/config";

export interface LoginDto {
  identifier: string;
  password: string;
  rememberMe?: boolean;  
}

export interface RegisterDto {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export const authService = {
  async login(data: LoginDto) {
    const res: any = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data);
    if (res.data?.accessToken) {
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }
    return res;
  },

  async register(data: RegisterDto) {
    return apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
  },

  async getProfile() {
    return apiClient.post(API_ENDPOINTS.AUTH.ME, {});
  },

  logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  },

  getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem("accessToken");
  },
};