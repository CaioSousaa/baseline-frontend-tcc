"use client";

import { useState, useEffect } from "react";
import { X, Check, Loader2 } from "lucide-react";
import { api } from "@/lib/axios";

interface Tag {
  _id: string;
  name: string;
  color: string;
}

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTagCreated: (tag: Tag) => void;
  existingTags: Tag[];
}

const TAG_COLORS = [
  "#EF4444", // Red 500
  "#F97316", // Orange 500
  "#F59E0B", // Amber 500
  "#10B981", // Emerald 500
  "#3B82F6", // Blue 500
  "#6366F1", // Indigo 500
  "#8B5CF6", // Violet 500
  "#EC4899", // Pink 500
  "#64748B", // Slate 500
  "#FF0000", // Pure Red
];

export function TagModal({ isOpen, onClose, onTagCreated, existingTags }: TagModalProps) {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const usedColors = existingTags.map((tag) => tag.color.toLowerCase());

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("O nome da tag é obrigatório.");
      return;
    }

    if (!selectedColor) {
      setError("Selecione uma cor para a tag.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post("/tag/create", {
        name,
        color: selectedColor,
      });
      onTagCreated(response.data);
      setName("");
      setSelectedColor("");
      onClose();
    } catch (err: unknown) {
      console.error("Erro ao criar tag:", err);
      if (err instanceof Error && 'response' in err) {
        const axiosError = err as { response: { data: { message: string } } };
        setError(axiosError.response?.data?.message || "Erro ao criar tag. Tente novamente.");
      } else {
        setError("Erro ao criar tag. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-zinc-800">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50">
          <h2 className="text-xl font-bold text-zinc-100">Nova Tag</h2>
          <button
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="tag-name" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Nome da Tag
            </label>
            <input
              id="tag-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Urgente, Estudo, Trabalho..."
              className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all text-zinc-100 placeholder:text-zinc-600"
              autoFocus
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Escolha uma Cor
            </label>
            <div className="grid grid-cols-5 gap-3">
              {TAG_COLORS.map((color) => {
                const isUsed = usedColors.includes(color.toLowerCase());
                const isSelected = selectedColor === color;

                return (
                  <button
                    key={color}
                    type="button"
                    disabled={isUsed}
                    onClick={() => setSelectedColor(color)}
                    className={`
                      relative h-10 w-full rounded-xl transition-all flex items-center justify-center
                      ${isUsed ? 'opacity-10 cursor-not-allowed grayscale' : 'hover:scale-105 active:scale-95 cursor-pointer shadow-md'}
                      ${isSelected ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-zinc-900' : ''}
                    `}
                    style={{ backgroundColor: color }}
                    title={isUsed ? "Cor já utilizada" : color}
                  >
                    {isSelected && <Check className="w-5 h-5 text-white drop-shadow-sm" />}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <p className="text-sm font-bold text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-zinc-700 text-zinc-400 font-bold rounded-xl hover:bg-zinc-800 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-amber-400 text-zinc-900 font-bold rounded-xl hover:bg-amber-500 transition-all shadow-lg shadow-amber-900/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Criar Tag"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
