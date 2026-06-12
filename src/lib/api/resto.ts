import api from "./axios";
import type { Restaurant, RestaurantDetail, PaginatedResponse, RestaurantFilter } from "@/types";

export const restoApi = {
  getList: async (params?: RestaurantFilter): Promise<PaginatedResponse<Restaurant>> => {
    const res = await api.get("/api/resto", { params });
    return res.data?.data ?? res.data;
  },

  getById: async (
    id: string,
    params?: { limitMenu?: number; limitReview?: number }
  ): Promise<RestaurantDetail> => {
    const res = await api.get(`/api/resto/${id}`, { params });
    return res.data?.data ?? res.data;
  },

  search: async (params: { q: string; page?: number; limit?: number }): Promise<PaginatedResponse<Restaurant>> => {
    const res = await api.get("/api/resto/search", { params });
    return res.data?.data ?? res.data;
  },

  getBestSeller: async (params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Restaurant>> => {
    const res = await api.get("/api/resto/best-seller", { params });
    return res.data?.data ?? res.data;
  },

  getRecommended: async (params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Restaurant>> => {
    const res = await api.get("/api/resto/recommended", { params });
    return res.data?.data ?? res.data;
  },

  getNearby: async (params?: { range?: number; limit?: number }): Promise<Restaurant[]> => {
    const res = await api.get("/api/resto/nearby", { params });
    return res.data?.data ?? res.data;
  },
};
