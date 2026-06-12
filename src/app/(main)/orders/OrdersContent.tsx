"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Package, CheckCircle } from "lucide-react";
import { orderApi } from "@/lib/api/order";
import { queryKeys } from "@/lib/query/hooks";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { formatCurrency, formatDate, ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from "@/lib/utils";

const STATUSES = ["", "pending", "processing", "delivered", "cancelled"];
const STATUS_LABELS: Record<string, string> = {
  "": "Semua",
  pending: "Menunggu",
  processing: "Diproses",
  delivered: "Selesai",
  cancelled: "Dibatalkan",
};

export default function OrdersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const activeStatus = searchParams.get("status") ?? "";
  const isSuccess = searchParams.get("success") === "1";

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  const { data: orders, isLoading } = useQuery({
    queryKey: queryKeys.orders(activeStatus),
    queryFn: () => orderApi.getMyOrders({ status: activeStatus || undefined, limit: 20 }),
    enabled: isAuthenticated,
  });

  const handleStatusFilter = (status: string) => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    router.push("/orders?" + params.toString());
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {isSuccess && (
        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl border border-green-100">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-green-800">Pesanan berhasil dibuat!</p>
            <p className="text-sm text-green-600">Pesananmu sedang diproses oleh restoran.</p>
          </div>
        </div>
      )}

      <h1 className="font-bold text-2xl text-gray-900">Riwayat Pesanan</h1>

      {/* Status filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => handleStatusFilter(s)}
            className={
              "flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors " +
              (activeStatus === s
                ? "bg-[#C8102E] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200")
            }
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse p-4 bg-gray-100 rounded-2xl h-24" />
          ))}
        </div>
      ) : !orders?.data?.length ? (
        <div className="text-center py-16">
          <Package className="w-14 h-14 text-gray-200 mx-auto mb-3" />
          <p className="font-semibold text-gray-500">Belum ada pesanan</p>
          <p className="text-sm text-gray-400 mt-1 mb-6">Yuk mulai pesan makanan favoritmu!</p>
          <Button onClick={() => router.push("/")}>Cari Restoran</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.data.map((order) => (
            <div
              key={order.id}
              className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-sm text-gray-900">
                    #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
                </div>
                <span
                  className={
                    "text-xs font-semibold px-2.5 py-1 rounded-full " +
                    (ORDER_STATUS_COLOR[order.status] ?? "bg-gray-100 text-gray-600")
                  }
                >
                  {ORDER_STATUS_LABEL[order.status] ?? order.status}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                <div>
                  <p className="text-xs text-gray-500 truncate max-w-48">{order.deliveryAddress}</p>
                  <p className="text-xs text-gray-400 mt-0.5 capitalize">{order.paymentMethod}</p>
                </div>
                <p className="font-bold text-[#C8102E]">{formatCurrency(order.totalAmount)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
