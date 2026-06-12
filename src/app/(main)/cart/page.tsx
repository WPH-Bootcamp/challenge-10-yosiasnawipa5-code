"use client";

export const dynamic = "force-dynamic";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart, useUpdateCartItem, useDeleteCartItem, useClearCart } from "@/lib/query/hooks";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/shared/Toast";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { useEffect } from "react";

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { showToast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  const { data: cart, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const deleteItem = useDeleteCartItem();
  const clearCart = useClearCart();

  const totalItems = cart?.reduce((s, g) => s + g.items.reduce((ss, i) => ss + i.quantity, 0), 0) ?? 0;
  const totalPrice = cart?.reduce(
    (s, g) => s + g.items.reduce((ss, i) => ss + i.quantity * (i.menu?.price ?? 0), 0),
    0
  ) ?? 0;

  const handleUpdate = async (id: string, quantity: number) => {
    try {
      await updateItem.mutateAsync({ id, quantity });
    } catch {
      showToast("Gagal memperbarui cart", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem.mutateAsync(id);
      showToast("Item dihapus dari cart");
    } catch {
      showToast("Gagal menghapus item", "error");
    }
  };

  const handleClear = async () => {
    try {
      await clearCart.mutateAsync();
      showToast("Cart dikosongkan");
    } catch {
      showToast("Gagal mengosongkan cart", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3 p-4 bg-gray-100 rounded-xl">
              <div className="w-16 h-16 bg-gray-200 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!cart?.length) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h2 className="font-bold text-xl text-gray-700 mb-2">Cart kamu masih kosong</h2>
        <p className="text-gray-400 text-sm mb-6">Tambahkan menu favoritmu dari restoran pilihanmu.</p>
        <Button onClick={() => router.push("/")}>Cari Restoran</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-32">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-bold text-2xl text-gray-900">Cart</h1>
        {totalItems > 0 && (
          <button
            onClick={handleClear}
            disabled={clearCart.isPending}
            className="text-sm text-red-500 hover:underline"
          >
            Kosongkan Cart
          </button>
        )}
      </div>

      <div className="space-y-6">
        {cart.map((group) => (
          <div key={group.restaurant.id} className="space-y-3">
            {/* Restaurant header */}
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-orange-100">
                {group.restaurant.logo ? (
                  <Image src={group.restaurant.logo} alt={group.restaurant.name} width={32} height={32} className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-orange-500">
                    {group.restaurant.name.charAt(0)}
                  </div>
                )}
              </div>
              <Link href={`/resto/${group.restaurant.id}`} className="font-semibold text-sm text-gray-800 hover:text-[#C8102E]">
                {group.restaurant.name}
              </Link>
            </div>

            {/* Items */}
            {group.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  {item.menu?.image ? (
                    <Image src={item.menu.image} alt={item.menu.name} fill className="object-cover" sizes="64px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">🍽️</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 truncate">{item.menu?.name}</p>
                  <p className="text-sm text-[#C8102E] font-medium mt-0.5">
                    {formatCurrency((item.menu?.price ?? 0) * item.quantity)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => item.quantity > 1 ? handleUpdate(item.id, item.quantity - 1) : handleDelete(item.id)}
                    className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#C8102E] hover:text-[#C8102E] transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-5 text-center text-sm font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdate(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-full bg-[#C8102E] text-white flex items-center justify-center hover:bg-[#a00d25] transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="ml-1 p-1 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Sticky checkout bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-2xl">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">{totalItems} items</p>
            <p className="font-bold text-gray-900">{formatCurrency(totalPrice)}</p>
          </div>
          <Button onClick={() => router.push("/checkout")}>
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
