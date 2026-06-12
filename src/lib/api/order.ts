import api from "./axios";
import type { Order, PaginatedResponse } from "@/types";

export interface CheckoutPayload {
  restaurants: {
    restaurantId: string;
    items: { menuId: string; quantity: number }[];
  }[];
  deliveryAddress: string;
  phone?: string;
  paymentMethod?: string;
  notes?: string;
}

export const orderApi = {
  checkout: async (data: CheckoutPayload): Promise<Order> => {
    const res = await api.post("/api/order/checkout", data);
    return res.data?.data ?? res.data;
  },

  getMyOrders: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Order>> => {
    const res = await api.get("/api/order/my-order", { params });
    return res.data?.data ?? res.data;
  },
};
