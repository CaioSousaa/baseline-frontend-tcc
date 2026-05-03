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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-900">Nova Tag</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="tag-name" className="text-sm font-semibold text-slate-700">
              Nome da Tag
            </label>
            <input
              id="tag-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Urgente, Estudo, Trabalho..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
              autoFocus
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">
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
                      ${isUsed ? 'opacity-20 cursor-not-allowed grayscale' : 'hover:scale-105 active:scale-95 cursor-pointer shadow-sm'}
                      ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
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
            <p className="text-sm font-medium text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
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
