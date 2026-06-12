"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Star, MapPin, Share2, Plus, Minus, ShoppingCart, ArrowLeft } from "lucide-react";
import { useRestaurantDetail, useAddToCart, useUpdateCartItem, useDeleteCartItem, useCart } from "@/lib/query/hooks";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/shared/Toast";
import { useAuthStore } from "@/store/auth";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { MenuItem } from "@/types";

type MenuTab = "All Menu" | "Food" | "Drink";

export default function RestoDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<MenuTab>("All Menu");

  const { data: resto, isLoading } = useRestaurantDetail(id);
  const { data: cart } = useCart();
  const addToCart = useAddToCart();
  const updateItem = useUpdateCartItem();
  const deleteItem = useDeleteCartItem();

  const cartGroup = cart?.find((g) => g.restaurant.id === id);
  const totalCartItems = cart?.reduce((s, g) => s + g.items.reduce((ss, i) => ss + i.quantity, 0), 0) ?? 0;
  const totalCartPrice =
    cart?.reduce((s, g) => s + g.items.reduce((ss, i) => ss + i.quantity * (i.menu?.price ?? 0), 0), 0) ?? 0;

  const getCartItem = (menuId: string) => cartGroup?.items.find((i) => i.menuId === menuId);

  const filteredMenus =
    resto?.menus?.filter((m) => {
      if (activeTab === "All Menu") return true;
      if (activeTab === "Drink")
        return (
          m.category?.toLowerCase().includes("drink") || m.category?.toLowerCase().includes("minuman")
        );
      return (
        !m.category?.toLowerCase().includes("drink") && !m.category?.toLowerCase().includes("minuman")
      );
    }) ?? [];

  const handleAdd = async (menu: MenuItem) => {
    if (!isAuthenticated) {
      showToast("Silakan login untuk memesan", "error");
      router.push("/login");
      return;
    }
    try {
      await addToCart.mutateAsync({ restaurantId: id, menuId: menu.id, quantity: 1 });
      showToast(menu.name + " ditambahkan!");
    } catch {
      showToast("Gagal menambahkan ke cart", "error");
    }
  };

  const handleIncrease = async (cartItemId: string, currentQty: number) => {
    try {
      await updateItem.mutateAsync({ id: cartItemId, quantity: currentQty + 1 });
    } catch {
      showToast("Gagal update cart", "error");
    }
  };

  const handleDecrease = async (cartItemId: string, currentQty: number) => {
    try {
      if (currentQty <= 1) {
        await deleteItem.mutateAsync(cartItemId);
      } else {
        await updateItem.mutateAsync({ id: cartItemId, quantity: currentQty - 1 });
      }
    } catch {
      showToast("Gagal update cart", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4 animate-pulse">
        <div className="grid grid-cols-2 gap-2 h-52">
          <div className="bg-gray-200 rounded-xl" />
          <div className="grid grid-rows-2 gap-2">
            <div className="bg-gray-200 rounded-xl" />
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-200 rounded-xl" />
              <div className="bg-gray-200 rounded-xl" />
            </div>
          </div>
        </div>
        <div className="h-14 bg-gray-200 rounded-xl" />
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-square bg-gray-200 rounded-xl" />
              <div className="h-3 bg-gray-200 rounded" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!resto) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p>Restoran tidak ditemukan.</p>
        <button
          onClick={() => router.back()}
          className="mt-3 text-[#C8102E] font-medium text-sm hover:underline"
        >
          Kembali
        </button>
      </div>
    );
  }

  const images: string[] =
    resto.images && resto.images.length > 0
      ? resto.images
      : [
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
          "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80",
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&q=80",
          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&q=80",
        ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-28 space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </button>

      {/* Photo grid */}
      <div className="grid grid-cols-2 gap-2 h-52 rounded-2xl overflow-hidden">
        <div className="relative">
          <Image src={images[0]} alt={resto.name} fill className="object-cover" sizes="50vw" />
        </div>
        <div className="grid grid-rows-2 gap-2">
          <div className="relative rounded-xl overflow-hidden">
            <Image src={images[1] ?? images[0]} alt="" fill className="object-cover" sizes="25vw" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative rounded-xl overflow-hidden">
              <Image src={images[2] ?? images[0]} alt="" fill className="object-cover" sizes="12vw" />
            </div>
            <div className="relative rounded-xl overflow-hidden">
              <Image src={images[3] ?? images[0]} alt="" fill className="object-cover" sizes="12vw" />
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="flex items-start gap-3">
        <div className="w-14 h-14 rounded-xl flex-shrink-0 overflow-hidden bg-orange-50 border border-orange-100">
          {resto.logo ? (
            <Image
              src={resto.logo}
              alt={resto.name}
              width={56}
              height={56}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-bold text-orange-500 text-xl">
              {resto.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h1 className="font-bold text-xl text-gray-900">{resto.name}</h1>
          <div className="flex items-center gap-1 mt-0.5">
            <Star className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
            <span className="text-sm font-semibold">{resto.rating?.toFixed(1) ?? "—"}</span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500">
              {resto.location}
              {resto.distance ? " · " + resto.distance.toFixed(1) + " km" : ""}
            </span>
          </div>
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Share2 className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Menu */}
      <section>
        <h2 className="font-bold text-xl text-gray-900 mb-3">Menu</h2>
        <div className="flex items-center gap-2 mb-4">
          {(["All Menu", "Food", "Drink"] as MenuTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={
                "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors " +
                (activeTab === tab
                  ? "bg-[#C8102E] text-white border-[#C8102E]"
                  : "text-gray-600 border-gray-200 hover:bg-gray-50")
              }
            >
              {tab}
            </button>
          ))}
        </div>

        {filteredMenus.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">Tidak ada menu tersedia</div>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {filteredMenus.map((menu) => {
              const cartItem = getCartItem(menu.id);
              return (
                <div key={menu.id} className="space-y-1.5">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                    {menu.image ? (
                      <Image
                        src={menu.image}
                        alt={menu.name}
                        fill
                        className="object-cover"
                        sizes="25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">
                        🍽️
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-gray-800 truncate">{menu.name}</p>
                  <p className="text-xs text-gray-500">{formatCurrency(menu.price)}</p>
                  {cartItem ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDecrease(cartItem.id, cartItem.quantity)}
                        className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        <Minus className="w-3 h-3 text-gray-700" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{cartItem.quantity}</span>
                      <button
                        onClick={() => handleIncrease(cartItem.id, cartItem.quantity)}
                        className="w-6 h-6 rounded-full bg-[#C8102E] flex items-center justify-center hover:bg-[#a00d25] transition-colors"
                      >
                        <Plus className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAdd(menu)}
                      disabled={addToCart.isPending}
                      className="w-full bg-[#C8102E] text-white text-xs font-semibold py-1.5 rounded-full hover:bg-[#a00d25] transition-colors disabled:opacity-50"
                    >
                      Add
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {(resto.menus?.length ?? 0) > 8 && (
          <div className="text-center mt-5">
            <Button variant="outline" size="sm">
              Show More
            </Button>
          </div>
        )}
      </section>

      {/* Reviews */}
      <section>
        <h2 className="font-bold text-xl text-gray-900 mb-1">Review</h2>
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 fill-[#FFB800] text-[#FFB800]" />
          <span className="font-bold text-lg">{resto.rating?.toFixed(1) ?? "—"}</span>
          <span className="text-gray-400 text-sm">
            ({(resto.reviewCount ?? resto.reviews?.length ?? 0)} Ulasan)
          </span>
        </div>
        {!resto.reviews?.length ? (
          <p className="text-gray-400 text-sm text-center py-6">Belum ada ulasan.</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-5">
            {resto.reviews.slice(0, 6).map((review) => (
              <div key={review.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center text-xs font-bold text-[#C8102E] flex-shrink-0">
                    {review.user?.name?.charAt(0).toUpperCase() ?? "U"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 leading-none">
                      {review.user?.name ?? "Pengguna"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(review.createdAt)}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={
                        "w-3 h-3 " +
                        (i < review.star ? "fill-[#FFB800] text-[#FFB800]" : "fill-gray-200 text-gray-200")
                      }
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
        {(resto.reviews?.length ?? 0) > 6 && (
          <div className="text-center mt-5">
            <Button variant="outline" size="sm">
              Show More
            </Button>
          </div>
        )}
      </section>

      {/* Sticky Cart Bar */}
      {totalCartItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-2xl">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FFF0F2] flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 text-[#C8102E]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{totalCartItems} items</p>
                <p className="font-bold text-gray-900 text-sm">{formatCurrency(totalCartPrice)}</p>
              </div>
            </div>
            <Button onClick={() => router.push("/cart")} size="sm">
              Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
