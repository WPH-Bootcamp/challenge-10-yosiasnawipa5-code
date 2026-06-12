"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, MapPin } from "lucide-react";
import type { Restaurant } from "@/types";
import { formatDistance } from "@/lib/utils";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link
      href={`/resto/${restaurant.id}`}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
    >
      <div className="relative w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
        {restaurant.logo ? (
          <Image
            src={restaurant.logo}
            alt={restaurant.name}
            fill
            className="object-cover"
            sizes="56px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-orange-100 text-orange-500 font-bold text-xl">
            {restaurant.name.charAt(0)}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-gray-900 truncate group-hover:text-[#C8102E] transition-colors">
          {restaurant.name}
        </p>
        <div className="flex items-center gap-1 mt-0.5">
          <Star className="w-3 h-3 fill-[#FFB800] text-[#FFB800]" />
          <span className="text-xs text-gray-600">{restaurant.rating?.toFixed(1) ?? "—"}</span>
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <MapPin className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-500 truncate">
            {restaurant.location}
            {restaurant.distance ? ` · ${formatDistance(restaurant.distance)}` : ""}
          </span>
        </div>
      </div>
    </Link>
  );
}
