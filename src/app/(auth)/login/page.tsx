"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { loginSchema, type LoginFormData } from "@/lib/validations";
import { authApi } from "@/lib/api/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { useToast } from "@/components/shared/Toast";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      showToast("Selamat datang kembali!");
      router.push("/");
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? "Email atau password salah";
      showToast(msg, "error");
    },
  });

  const onSubmit = (data: LoginFormData) => loginMutation.mutate(data);

  return (
    <div className="w-full max-w-md">
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
        {/* Logo */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-3xl">✳️</span>
            <span className="font-bold text-2xl text-gray-900">Foody</span>
          </div>
          <h1 className="font-bold text-xl text-gray-900">Masuk ke akun kamu</h1>
          <p className="text-sm text-gray-500">Selamat datang kembali!</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="nama@email.com"
            leftIcon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.password?.message}
            {...register("password")}
          />
          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={loginMutation.isPending}
          >
            Masuk
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Belum punya akun?{" "}
          <Link href="/register" className="font-semibold text-[#C8102E] hover:underline">
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
