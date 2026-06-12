"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, User, LogOut, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useCart } from "@/lib/query/hooks";
import { useState } from "react";

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { data: cart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const totalItems = cart?.reduce((sum, group) => sum + group.items.reduce((s, i) => s + i.quantity, 0), 0) ?? 0;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[#C8102E] text-2xl">✳️</span>
          <span className="font-bold text-gray-900 text-lg">Foody</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#C8102E] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Link>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((p) => !p)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[#C8102E] text-white flex items-center justify-center text-xs font-bold">
                    {user?.name?.charAt(0).toUpperCase() ?? "U"}
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-24 truncate">
                    {user?.name ?? "User"}
                  </span>
                  <ChevronDown className="w-3 h-3 text-gray-500" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <Link
                      href="/orders"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Riwayat Pesanan
                    </Link>
                    <button
                      onClick={() => { logout(); setMenuOpen(false); }}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-gray-700 px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold text-white bg-[#C8102E] px-4 py-2 rounded-full hover:bg-[#a00d25] transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
