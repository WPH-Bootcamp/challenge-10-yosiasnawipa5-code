"use client";

export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MapPin, Phone, CreditCard, FileText, CheckCircle } from "lucide-react";
import { useCart } from "@/lib/query/hooks";
import { orderApi } from "@/lib/api/order";
import { checkoutSchema, type CheckoutFormData } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/shared/Toast";
import { formatCurrency } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { queryKeys } from "@/lib/query/hooks";

const PAYMENT_METHODS = [
  { value: "cash", label: "Tunai (Cash)" },
  { value: "transfer", label: "Transfer Bank" },
  { value: "ewallet", label: "E-Wallet" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { showToast } = useToast();
  const qc = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  const { data: cart } = useCart();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: "cash" },
  });

  const checkoutMutation = useMutation({
    mutationFn: orderApi.checkout,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.cart() });
      showToast("Pesanan berhasil dibuat!");
      router.push("/orders?success=1");
    },
    onError: () => showToast("Gagal membuat pesanan", "error"),
  });

  const totalPrice = cart?.reduce(
    (s, g) => s + g.items.reduce((ss, i) => ss + i.quantity * (i.menu?.price ?? 0), 0),
    0
  ) ?? 0;

  const onSubmit = (data: CheckoutFormData) => {
    if (!cart?.length) return;
    const restaurants = cart.map((group) => ({
      restaurantId: group.restaurant.id,
      items: group.items.map((item) => ({ menuId: item.menuId, quantity: item.quantity })),
    }));
    checkoutMutation.mutate({
      restaurants,
      deliveryAddress: data.deliveryAddress,
      phone: data.phone,
      paymentMethod: data.paymentMethod,
      notes: data.notes,
    });
  };

  if (!cart?.length) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400">Cart kosong. <button onClick={() => router.push("/")} className="text-[#C8102E] font-semibold">Kembali ke Home</button></p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      <h1 className="font-bold text-2xl text-gray-900">Checkout</h1>

      {/* Order summary */}
      <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
        <p className="font-semibold text-sm text-gray-700">Ringkasan Pesanan</p>
        {cart.map((group) => (
          <div key={group.restaurant.id}>
            <p className="text-xs font-semibold text-gray-500 mb-1">{group.restaurant.name}</p>
            {group.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-700">{item.menu?.name} × {item.quantity}</span>
                <span className="font-medium">{formatCurrency((item.menu?.price ?? 0) * item.quantity)}</span>
              </div>
            ))}
          </div>
        ))}
        <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
          <span>Total</span>
          <span className="text-[#C8102E]">{formatCurrency(totalPrice)}</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Alamat Pengiriman"
          placeholder="Masukkan alamat lengkap..."
          leftIcon={<MapPin className="w-4 h-4" />}
          error={errors.deliveryAddress?.message}
          {...register("deliveryAddress")}
        />
        <Input
          label="Nomor Telepon (opsional)"
          placeholder="08xxxxxxxxxx"
          leftIcon={<Phone className="w-4 h-4" />}
          {...register("phone")}
        />

        {/* Payment method */}
        <div>
          <p className="block text-sm font-medium text-gray-700 mb-2">Metode Pembayaran</p>
          <div className="grid grid-cols-3 gap-2">
            {PAYMENT_METHODS.map((m) => (
              <label key={m.value} className="relative cursor-pointer">
                <input type="radio" value={m.value} {...register("paymentMethod")} className="peer sr-only" />
                <div className="flex items-center justify-center p-3 rounded-xl border-2 border-gray-200 text-xs font-medium text-gray-600 text-center peer-checked:border-[#C8102E] peer-checked:text-[#C8102E] peer-checked:bg-[#FFF0F2] transition-all">
                  {m.label}
                </div>
              </label>
            ))}
          </div>
          {errors.paymentMethod && <p className="mt-1 text-xs text-red-500">{errors.paymentMethod.message}</p>}
        </div>

        <Input
          label="Catatan (opsional)"
          placeholder="Catatan untuk kurir atau restoran..."
          leftIcon={<FileText className="w-4 h-4" />}
          {...register("notes")}
        />

        <Button
          type="submit"
          className="w-full"
          size="lg"
          loading={checkoutMutation.isPending}
        >
          Buat Pesanan — {formatCurrency(totalPrice)}
        </Button>
      </form>
    </div>
  );
}
