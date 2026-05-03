"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/lib/axios";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.email("E-mail inválido").nonempty("O e-mail é obrigatório"),
  password: z.string().nonempty("A senha é obrigatória").min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function handleLogin(data: LoginFormData) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post("/auth/login", data);

      const { token } = response.data;

      if (token) {
        localStorage.setItem("@baseline:token", token);
        router.push("/");
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "Erro ao realizar login. Tente novamente.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex-1 flex items-center justify-center p-6">
      <div className="auth-card">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Bem-vindo de volta</h1>
          <p className="text-slate-500 mt-1">Entre na sua conta para gerenciar suas tarefas</p>
        </div>

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="email">
              E-mail
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              placeholder="seu@email.com"
              className="input-field"
              disabled={isLoading}
            />
            {errors.email && <p className="error-message">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="password">
              Senha
            </label>
            <input
              {...register("password")}
              type="password"
              id="password"
              placeholder="••••••••"
              className="input-field"
              disabled={isLoading}
            />
            {errors.password && <p className="error-message">{errors.password.message}</p>}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary flex items-center justify-center gap-2" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Ainda não tem uma conta?{" "}
          <Link href="/register" className="text-blue-600 font-semibold hover:underline">
            Criar conta
          </Link>
        </div>
      </div>
    </main>
  );
}
