import api from "./axios";
import type { AuthResponse, User } from "@/types";

export const authApi = {
  register: async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<AuthResponse> => {
    const res = await api.post("/api/auth/register", data);
    return res.data;
  },

  login: async (data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const res = await api.post("/api/auth/login", data);
    return res.data;
  },

  getProfile: async (): Promise<User> => {
    const res = await api.get("/api/auth/profile");
    return res.data?.data ?? res.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const res = await api.put("/api/auth/profile", data);
    return res.data?.data ?? res.data;
  },
};
