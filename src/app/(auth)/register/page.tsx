"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Phone } from "lucide-react";
import { registerSchema, type RegisterFormData } from "@/lib/validations";
import { authApi } from "@/lib/api/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { useToast } from "@/components/shared/Toast";

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      showToast("Akun berhasil dibuat! Selamat datang 🎉");
      router.push("/");
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? "Gagal membuat akun. Coba lagi.";
      showToast(msg, "error");
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    const { confirmPassword, ...payload } = data;
    registerMutation.mutate(payload);
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-3xl">✳️</span>
            <span className="font-bold text-2xl text-gray-900">Foody</span>
          </div>
          <h1 className="font-bold text-xl text-gray-900">Buat akun baru</h1>
          <p className="text-sm text-gray-500">Daftar dan mulai pesan sekarang!</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nama Lengkap"
            placeholder="John Doe"
            leftIcon={<User className="w-4 h-4" />}
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            label="Email"
            type="email"
            placeholder="nama@email.com"
            leftIcon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Nomor HP"
            type="tel"
            placeholder="08xxxxxxxxxx"
            leftIcon={<Phone className="w-4 h-4" />}
            error={errors.phone?.message}
            {...register("phone")}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.password?.message}
            {...register("password")}
          />
          <Input
            label="Konfirmasi Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={registerMutation.isPending}
          >
            Buat Akun
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-semibold text-[#C8102E] hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
