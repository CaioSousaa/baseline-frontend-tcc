"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/lib/axios";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const registerSchema = z.object({
  name: z.string().nonempty("O nome é obrigatório").min(2, "O nome deve ter no mínimo 2 caracteres"),
  email: z.string().nonempty("O e-mail é obrigatório").email("E-mail inválido"),
  password: z.string().nonempty("A senha é obrigatória").min(8, "A senha deve ter no mínimo 8 caracteres"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function handleRegister(data: RegisterFormData) {
    setIsLoading(true);
    setError(null);

    try {
      await api.post("/user/create", data);

      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof Error && 'response' in err) {
        const axiosError = err as { response: { data: { message: string } } };
        setError(axiosError.response?.data?.message || "Erro ao criar conta. Tente novamente.");
      } else {
        setError("Erro ao criar conta. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex-1 flex items-center justify-center p-6 bg-linear-to-b from-black via-zinc-950 to-zinc-700 min-h-screen">
      <div className="bg-zinc-900 p-8 rounded-xl h-[600px] shadow-sm border border-zinc-700 w-full max-w-md flex flex-col justify-between">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-2xl font-bold text-zinc-200">Sign Up</h1>
          <div className="border-2 border-amber-400 w-14 h-1 bg-amber-400 rounded-xl" />
        </div>

        <form onSubmit={handleSubmit(handleRegister)} className="space-y-6 flex-1 flex flex-col justify-center">
          <div>
            <label className="block text-sm font-medium text-zinc-200" htmlFor="name">
              Nome Completo
            </label>
            <input
              {...register("name")}
              type="text"
              id="name"
              placeholder="João Silva"
              className="input-field"
              disabled={isLoading}
            />
            {errors.name && <p className="error-message">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-200" htmlFor="email">
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
            <label className="block text-sm font-medium text-zinc-200" htmlFor="password">
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
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary flex items-center justify-center gap-2" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Criando conta...
              </>
            ) : (
              "Cadastrar"
            )}
          </button>
        </form>

        <div className="text-center text-sm text-zinc-200">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-amber-400 font-semibold hover:underline">
            Entrar agora
          </Link>
        </div>
      </div>
    </main>
  );
}
