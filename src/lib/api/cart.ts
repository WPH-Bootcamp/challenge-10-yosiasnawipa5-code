import api from "./axios";
import type { CartGroup } from "@/types";

export const cartApi = {
  getCart: async (): Promise<CartGroup[]> => {
    const res = await api.get("/api/cart");
    return res.data?.data ?? res.data;
  },

  addItem: async (data: {
    restaurantId: string;
    menuId: string;
    quantity: number;
  }): Promise<void> => {
    await api.post("/api/cart", data);
  },

  updateItem: async (id: string, quantity: number): Promise<void> => {
    await api.put(`/api/cart/${id}`, { quantity });
  },

  deleteItem: async (id: string): Promise<void> => {
    await api.delete(`/api/cart/${id}`);
  },

  clearCart: async (): Promise<void> => {
    await api.delete("/api/cart");
  },
};
