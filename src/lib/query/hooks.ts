import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { restoApi } from "@/lib/api/resto";
import { cartApi } from "@/lib/api/cart";
import type { RestaurantFilter } from "@/types";

// Query Keys
export const queryKeys = {
  restaurants: (filters?: RestaurantFilter) => ["restaurants", filters] as const,
  restaurantDetail: (id: string) => ["restaurant", id] as const,
  restaurantSearch: (q: string) => ["restaurants", "search", q] as const,
  bestSeller: (page?: number) => ["restaurants", "best-seller", page] as const,
  recommended: () => ["restaurants", "recommended"] as const,
  nearby: () => ["restaurants", "nearby"] as const,
  cart: () => ["cart"] as const,
  orders: (status?: string) => ["orders", status] as const,
  myReviews: () => ["reviews", "mine"] as const,
};

// Restaurant Hooks
export function useRestaurants(filters?: RestaurantFilter) {
  return useQuery({
    queryKey: queryKeys.restaurants(filters),
    queryFn: () => restoApi.getList(filters),
  });
}

export function useRestaurantDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.restaurantDetail(id),
    queryFn: () => restoApi.getById(id, { limitMenu: 20, limitReview: 6 }),
    enabled: !!id,
  });
}

export function useBestSeller(page?: number) {
  return useQuery({
    queryKey: queryKeys.bestSeller(page),
    queryFn: () => restoApi.getBestSeller({ page, limit: 8 }),
  });
}

export function useRecommended() {
  return useQuery({
    queryKey: queryKeys.recommended(),
    queryFn: () => restoApi.getRecommended({ limit: 8 }),
  });
}

// Cart Hooks
export function useCart() {
  return useQuery({
    queryKey: queryKeys.cart(),
    queryFn: () => cartApi.getCart(),
  });
}

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: cartApi.addItem,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.cart() }),
  });
}

export function useUpdateCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      cartApi.updateItem(id, quantity),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.cart() }),
  });
}

export function useDeleteCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: cartApi.deleteItem,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.cart() }),
  });
}

export function useClearCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.cart() }),
  });
}
