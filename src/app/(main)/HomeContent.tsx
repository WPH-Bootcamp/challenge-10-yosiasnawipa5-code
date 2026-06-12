"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRestaurants, useRecommended, useBestSeller } from "@/lib/query/hooks";
import { RestaurantCard } from "@/components/shared/RestaurantCard";
import { RestaurantCardSkeleton } from "@/components/shared/Skeleton";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { restoApi } from "@/lib/api/resto";
import { useQuery } from "@tanstack/react-query";

const CATEGORIES = [
  { id: "", label: "All Restaurant", icon: "🍽️" },
  { id: "nearby", label: "Nearby", icon: "📍" },
  { id: "discount", label: "Discount", icon: "🏷️" },
  { id: "best-seller", label: "Best Seller", icon: "🏆" },
  { id: "delivery", label: "Delivery", icon: "🛵" },
  { id: "lunch", label: "Lunch", icon: "🍱" },
];

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();

  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");
  const activeCategory = searchParams.get("category") ?? "";
  const [page, setPage] = useState(1);

  const searchQ = searchParams.get("q") ?? "";

  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ["restaurants", "search", searchQ],
    queryFn: () => restoApi.search({ q: searchQ, limit: 12 }),
    enabled: searchQ.length > 1,
  });

  const { data: recommended, isLoading: recLoading } = useRecommended();
  const { data: bestSeller, isLoading: bsLoading } = useBestSeller();

  const { data: allRestaurants, isLoading: allLoading } = useRestaurants({
    category: activeCategory || undefined,
    page,
    limit: 8,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchInput.trim()) params.set("q", searchInput.trim());
    router.push("/?" + params.toString());
  };

  const handleCategoryClick = (id: string) => {
    const params = new URLSearchParams();
    if (id) params.set("category", id);
    router.push("/?" + params.toString());
    setPage(1);
  };

  const showingSearch = searchQ.length > 1;

  return (
    <div>
      {/* Hero */}
      <section className="relative h-72 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1400&q=80"
          alt="Foody hero"
          fill
          className="object-cover object-center"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/60" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow">
            Explore Culinary Experiences
          </h1>
          <p className="text-gray-200 text-sm mb-6 drop-shadow">
            Search and refine your choice to discover the perfect restaurant.
          </p>
          <form onSubmit={handleSearch} className="w-full max-w-lg">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search restaurants, food and drink"
                className="w-full pl-11 pr-4 py-3 rounded-full bg-white/95 backdrop-blur text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C8102E] shadow-lg"
              />
            </div>
          </form>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        {/* Category chips */}
        <section>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={
                  "flex flex-col items-center gap-1.5 flex-shrink-0 px-5 py-3 rounded-xl transition-all " +
                  (activeCategory === cat.id && !showingSearch
                    ? "bg-[#FFF0F2] text-[#C8102E] shadow-sm"
                    : "text-gray-500 hover:bg-gray-50")
                }
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-medium whitespace-nowrap">{cat.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Search Results */}
        {showingSearch && (
          <section>
            <h2 className="font-bold text-xl text-gray-900 mb-4">
              Hasil untuk &quot;{searchQ}&quot;
            </h2>
            {searchLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <RestaurantCardSkeleton key={i} />
                ))}
              </div>
            ) : !searchResults?.data?.length ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                <p className="font-semibold text-gray-500">Restoran tidak ditemukan</p>
                <p className="text-sm text-gray-400 mt-1">Coba kata kunci yang lain</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
                {searchResults.data.map((r) => (
                  <RestaurantCard key={r.id} restaurant={r} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Recommended — logged in users */}
        {isAuthenticated && !showingSearch && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-xl text-gray-900">Recommended</h2>
              <Link
                href="/?category=recommended"
                className="text-[#C8102E] text-sm font-semibold hover:underline"
              >
                See All
              </Link>
            </div>
            {recLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <RestaurantCardSkeleton key={i} />
                ))}
              </div>
            ) : !recommended?.data?.length ? (
              <p className="text-gray-400 text-sm py-4">Belum ada rekomendasi untukmu.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
                {recommended.data.slice(0, 6).map((r) => (
                  <RestaurantCard key={r.id} restaurant={r} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* All / filtered restaurants */}
        {!showingSearch && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-xl text-gray-900">
                {activeCategory
                  ? CATEGORIES.find((c) => c.id === activeCategory)?.label ?? "Restoran"
                  : "Semua Restoran"}
              </h2>
            </div>
            {allLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <RestaurantCardSkeleton key={i} />
                ))}
              </div>
            ) : !allRestaurants?.data?.length ? (
              <div className="text-center py-12">
                <p className="text-gray-400 font-medium">Tidak ada restoran ditemukan</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
                  {allRestaurants.data.map((r) => (
                    <RestaurantCard key={r.id} restaurant={r} />
                  ))}
                </div>
                {(allRestaurants.totalPages ?? 1) > page && (
                  <div className="text-center mt-6">
                    <Button variant="outline" onClick={() => setPage((p) => p + 1)}>
                      Show More
                    </Button>
                  </div>
                )}
              </>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
