"use client";

import { X, Check, Filter } from "lucide-react";
import { Tag } from "../types";

interface FilterBarProps {
  isOpen: boolean;
  onClose: () => void;
  allTags: Tag[];
  filters: {
    priority: string[];
    tags: string[];
  };
  onFilterChange: (filters: {
    priority: string[];
    tags: string[];
  }) => void;
}

const priorityOptions = [
  { label: "Alta", value: "high" },
  { label: "Média", value: "medium" },
  { label: "Baixa", value: "low" },
];

export function FilterBar({ isOpen, onClose, allTags, filters, onFilterChange }: FilterBarProps) {
  if (!isOpen) return null;

  const toggleFilter = (type: "priority" | "tags", value: string) => {
    const current = filters[type];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    onFilterChange({ ...filters, [type]: updated });
  };

  const clearFilters = () => {
    onFilterChange({ priority: [], tags: [] });
  };

  const hasActiveFilters = filters.priority.length > 0 || filters.tags.length > 0;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div>
            <h3 className="font-bold text-zinc-100">Filtros</h3>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors px-2 py-1 uppercase tracking-widest"
            >
              Limpar todos
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Prioridade */}
        <div className="space-y-3">
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest block">Prioridade</span>
          <div className="flex flex-wrap gap-2">
            {priorityOptions.map((opt) => {
              const isActive = filters.priority.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => toggleFilter("priority", opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-2 ${isActive
                    ? "bg-amber-400 border-amber-400 text-zinc-900 shadow-md shadow-amber-900/20"
                    : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-700/50"
                    }`}
                >
                  {isActive && <Check className="w-3.5 h-3.5" />}
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-3">
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest block">Tags</span>
          <div className="flex flex-wrap gap-2">
            {allTags.length === 0 ? (
              <p className="text-sm text-slate-400 italic">Nenhuma tag cadastrada</p>
            ) : (
              allTags.map((tag) => {
                const isActive = filters.tags.includes(tag._id);
                return (
                  <button
                    key={tag._id}
                    onClick={() => toggleFilter("tags", tag._id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-2 ${isActive
                      ? "bg-amber-400 border-amber-400 text-zinc-900 shadow-md shadow-amber-900/20"
                      : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-700/50"
                      }`}
                  >
                    {!isActive && (
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                    )}
                    {tag.name}
                    {isActive && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
