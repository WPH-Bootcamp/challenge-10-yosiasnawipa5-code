import api from "./axios";
import type { Review } from "@/types";

export const reviewApi = {
  create: async (data: {
    transactionId: string;
    restaurantId: string;
    star: number;
    comment: string;
    menuIds?: string[];
  }): Promise<Review> => {
    const res = await api.post("/api/review", data);
    return res.data?.data ?? res.data;
  },

  getMyReviews: async (): Promise<Review[]> => {
    const res = await api.get("/api/review/my-reviews");
    return res.data?.data ?? res.data;
  },

  getByRestaurant: async (restaurantId: string): Promise<Review[]> => {
    const res = await api.get(`/api/review/restaurant/${restaurantId}`);
    return res.data?.data ?? res.data;
  },
};
