"use client";

import { useState } from "react";
import { X, Loader2, Save } from "lucide-react";
import { api } from "@/lib/axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const userSchema = z.object({
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres").optional().or(z.literal('')),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres").optional().or(z.literal('')),
}).refine(data => data.name || data.password, {
  message: "Preencha ao menos um campo para atualizar",
  path: ["name"]
});

type UserFormData = z.infer<typeof userSchema>;

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserModal({ isOpen, onClose }: UserModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  if (!isOpen) return null;

  function handleClose() {
    reset();
    setError(null);
    setSuccess(null);
    onClose();
  }

  async function onSubmit(data: UserFormData) {
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: any = {};
      if (data.name) updateData.name = data.name;
      if (data.password) updateData.password = data.password;

      await api.put("/user/update", updateData);

      setSuccess("Perfil atualizado com sucesso!");
      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (err: unknown) {
      console.error("Erro ao atualizar perfil:", err);
      if (err instanceof Error && 'response' in err) {
        const axiosError = err as { response: { data: { message: string } } };
        setError(axiosError.response?.data?.message || "Erro ao atualizar perfil. Tente novamente.");
      } else {
        setError("Erro ao atualizar perfil. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-zinc-800">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50">
          <h2 className="text-xl font-bold text-zinc-100">Configurações de Perfil</h2>
          <button
            onClick={handleClose}
            className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-200">
              Novo Nome
            </label>
            <input
              {...register("name")}
              type="text"
              placeholder="Seu novo nome"
              className="input-field text-zinc-200"
            />
            {errors.name && <p className="error-message">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-200">
              Nova Senha
            </label>
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className="input-field text-zinc-200"
            />
            {errors.password && <p className="error-message">{errors.password.message}</p>}
          </div>

          {error && (
            <p className="text-sm font-bold text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
              {error}
            </p>
          )}

          {success && (
            <p className="text-sm font-bold text-emerald-400 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
              {success}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-zinc-700 text-zinc-400 font-bold rounded-md hover:bg-zinc-800 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Salvar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
