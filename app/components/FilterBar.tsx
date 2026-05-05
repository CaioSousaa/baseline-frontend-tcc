"use client";

import { X, Check, Filter } from "lucide-react";
import { Tag } from "../types";

interface FilterBarProps {
  isOpen: boolean;
  onClose: () => void;
  allTags: Tag[];
  filters: {
    status: string[];
    priority: string[];
    tags: string[];
  };
  onFilterChange: (filters: {
    status: string[];
    priority: string[];
    tags: string[];
  }) => void;
}

const statusOptions = [
  { label: "Para Fazer", value: "todo" },
  { label: "Em Andamento", value: "in_progress" },
  { label: "Finalizado", value: "done" },
];

const priorityOptions = [
  { label: "Alta", value: "high" },
  { label: "Média", value: "medium" },
  { label: "Baixa", value: "low" },
];

export function FilterBar({ isOpen, onClose, allTags, filters, onFilterChange }: FilterBarProps) {
  if (!isOpen) return null;

  const toggleFilter = (type: "status" | "priority" | "tags", value: string) => {
    const current = filters[type];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    onFilterChange({ ...filters, [type]: updated });
  };

  const clearFilters = () => {
    onFilterChange({ status: [], priority: [], tags: [] });
  };

  const hasActiveFilters = filters.status.length > 0 || filters.priority.length > 0 || filters.tags.length > 0;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Filter className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Filtros</h3>
            <p className="text-xs text-slate-500">Refine sua visualização de tarefas</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors px-2 py-1"
            >
              Limpar todos
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Status */}
        <div className="space-y-3">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Status</span>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((opt) => {
              const isActive = filters.status.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => toggleFilter("status", opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all flex items-center gap-2 ${isActive
                      ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-200"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                >
                  {isActive && <Check className="w-3.5 h-3.5" />}
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Prioridade */}
        <div className="space-y-3">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Prioridade</span>
          <div className="flex flex-wrap gap-2">
            {priorityOptions.map((opt) => {
              const isActive = filters.priority.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => toggleFilter("priority", opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all flex items-center gap-2 ${isActive
                      ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-200"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
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
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Tags</span>
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
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all flex items-center gap-2 ${isActive
                        ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-200"
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
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
