"use client";

import { useState, useEffect } from "react";
import { X, Calendar, Flag, Tag as TagIcon, Plus, Loader2, Edit2, Check, Trash2, Bell } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/lib/axios";
import { TagModal } from "./TagModal";
import { Tag, Task } from "../types";

const taskSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string().min(5, "A descrição deve ter pelo menos 5 caracteres"),
  status: z.enum(["todo", "in_progress", "done"]),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string().min(1, "A data de vencimento é obrigatória").refine((date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }, "A data de vencimento não pode ser no passado"),
  alert: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskSaved: () => void;
  task?: Task | null;
}

export function TaskModal({ isOpen, onClose, onTaskSaved, task }: TaskModalProps) {
  const [isEditing, setIsEditing] = useState(!task);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      status: "todo",
      priority: "low",
      alert: "",
    },
  });

  const resetForm = () => {
    if (task) {
      const formattedDate = new Date(task.dueDate).toISOString().split('T')[0];
      reset({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: formattedDate,
        alert: task.alert || "",
      });
      const tags = task.tags || [];
      setSelectedTagIds(tags.map(t => typeof t === 'string' ? t : t._id));
    } else {
      reset({
        title: "",
        description: "",
        status: "todo",
        priority: "low",
        dueDate: "",
        alert: "",
      });
      setSelectedTagIds([]);
    }
    setError(null);
    setIsConfirmingDelete(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchTags();
      setIsEditing(!task);
      resetForm();
    }
  }, [isOpen, task]);

  async function fetchTags() {
    try {
      const response = await api.get("/tag/");
      const data = Array.isArray(response.data) ? response.data : [];
      setAvailableTags(data);
    } catch (err) {
      console.error("Erro ao carregar tags:", err);
      setAvailableTags([]);
    }
  }

  async function onSubmit(data: TaskFormData) {
    try {
      setIsLoading(true);
      setError(null);
      const payload = {
        ...data,
        tagId: selectedTagIds,
      };

      if (task) {
        await api.put(`/task/${task._id}`, payload);
      } else {
        await api.post("/task/create", payload);
      }

      onTaskSaved();
      onClose();
    } catch (err: any) {
      console.error("Erro ao salvar tarefa:", err);
      setError(err.response?.data?.message || "Ocorreu um erro ao salvar a tarefa.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!task) return;
    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true);
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);
      await api.delete(`/task/${task._id}`);
      onTaskSaved();
      onClose();
    } catch (err: any) {
      console.error("Erro ao excluir tarefa:", err);
      setError(err.response?.data?.message || "Ocorreu um erro ao excluir a tarefa.");
      setIsConfirmingDelete(false);
    } finally {
      setIsDeleting(false);
    }
  }

  function toggleTag(tagId: string) {
    if (!isEditing) return;
    setSelectedTagIds(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  }

  function handleCancelEdit() {
    if (task) {
      setIsEditing(false);
      resetForm();
    } else {
      onClose();
    }
  }

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
        <div className={`bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border transition-colors duration-300 ${isEditing ? 'border-amber-400/50 ring-1 ring-amber-400/20' : 'border-zinc-800'}`}>
          <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-zinc-100">
                {task ? (isEditing ? "Editar Tarefa" : "Detalhes da Tarefa") : "Nova Tarefa"}
              </h2>
              {task && (
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className={`p-2 rounded-lg transition-all ${isEditing ? 'bg-amber-400/20 text-amber-400' : 'hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300'}`}
                  title={isEditing ? "Cancelar edição" : "Editar tarefa"}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              {task && !isEditing && (
                <div className="flex items-center gap-1">
                  {isConfirmingDelete ? (
                    <div className="flex items-center bg-red-500/10 border border-red-500/20 rounded-lg overflow-hidden animate-in slide-in-from-right-2">
                      <span className="px-3 py-1 text-[10px] font-bold text-red-400 uppercase">Confirmar?</span>
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="p-2 bg-red-500 text-white hover:bg-red-600 transition-all disabled:opacity-50 border-l border-red-500/20"
                        title="Sim, excluir"
                      >
                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setIsConfirmingDelete(false)}
                        className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all"
                        title="Cancelar"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsConfirmingDelete(true)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                      title="Excluir tarefa"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}
              <button
                onClick={onClose}
                className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <input
                  {...register("title")}
                  disabled={!isEditing}
                  placeholder="Título da tarefa"
                  className={`w-full text-2xl font-bold bg-transparent border-none focus:outline-none placeholder:text-zinc-700 text-zinc-100 disabled:opacity-100`}
                />
                {errors.title && <p className="text-xs text-red-400 font-medium">{errors.title.message}</p>}
              </div>

              <div className="space-y-1">
                <textarea
                  {...register("description")}
                  disabled={!isEditing}
                  placeholder="Descreva o que precisa ser feito..."
                  rows={3}
                  className="w-full text-zinc-400 bg-transparent border-none focus:outline-none resize-none placeholder:text-zinc-700 disabled:opacity-100 text-sm leading-relaxed"
                />
                {errors.description && <p className="text-xs text-red-400 font-medium">{errors.description.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-y border-zinc-800">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                  <Check className="w-3 h-3" /> Status
                </label>
                <select
                  {...register("status")}
                  disabled={!isEditing}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm font-medium text-zinc-300 focus:outline-none focus:ring-2 focus:ring-amber-400/20 disabled:opacity-80 appearance-none cursor-pointer transition-all hover:border-zinc-600"
                >
                  <option value="todo">A Fazer</option>
                  <option value="in_progress">Em Progresso</option>
                  <option value="done">Concluído</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                  <Flag className="w-3 h-3" /> Prioridade
                </label>
                <select
                  {...register("priority")}
                  disabled={!isEditing}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm font-medium text-zinc-300 focus:outline-none focus:ring-2 focus:ring-amber-400/20 disabled:opacity-80 appearance-none cursor-pointer transition-all hover:border-zinc-600"
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" /> Vencimento
                </label>
                <input
                  type="date"
                  {...register("dueDate")}
                  disabled={!isEditing}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm font-medium text-zinc-300 focus:outline-none focus:ring-2 focus:ring-amber-400/20 disabled:opacity-80 cursor-pointer transition-all hover:border-zinc-600"
                />
                {errors.dueDate && <p className="text-xs text-red-400 font-medium">{errors.dueDate.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                <Bell className="w-3 h-3" /> Alerta Personalizado (Opcional)
              </label>
              <input
                {...register("alert")}
                disabled={!isEditing}
                placeholder="Ex: Não esquecer de revisar os anexos"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-300 focus:outline-none focus:ring-2 focus:ring-amber-400/20 disabled:opacity-80 transition-all hover:border-zinc-600"
              />
              <p className="text-[10px] text-zinc-500 italic">
                O sistema enviará uma notificação quando faltarem menos de 24h para o vencimento.
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                <TagIcon className="w-3 h-3" /> Tags
              </label>

              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => {
                  const isSelected = selectedTagIds.includes(tag._id);
                  return (
                    <button
                      key={tag._id}
                      type="button"
                      disabled={!isEditing}
                      onClick={() => toggleTag(tag._id)}
                      className={`
                        px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 text-white
                        ${isSelected
                          ? 'shadow-md scale-105'
                          : 'opacity-70 hover:opacity-100 hover:scale-105'}
                        ${isSelected && isEditing ? 'ring-2 ring-offset-2 ring-offset-zinc-900 ring-amber-400' : ''}
                        ${!isEditing && !isSelected ? 'hidden' : ''}
                        ${!isEditing ? 'cursor-default' : 'cursor-pointer'}
                      `}
                      style={{ backgroundColor: tag.color }}
                    >
                      {isSelected && isEditing && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      {tag.name}
                    </button>
                  );
                })}
                {!isEditing && selectedTagIds.length === 0 && (
                  <span className="text-sm text-slate-400 italic">Nenhuma tag selecionada</span>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            {isEditing && (
              <div className="flex flex-col md:flex-row gap-3 pt-6 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 px-4 py-3 border border-zinc-700 text-zinc-400 font-bold rounded-xl hover:bg-zinc-800 transition-all"
                >
                  Cancelar
                </button>

                <div className="flex flex-1 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsTagModalOpen(true)}
                    className="flex-1 px-4 py-3 bg-zinc-800 text-zinc-300 font-bold rounded-xl hover:bg-zinc-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Tag
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-[2] px-6 py-3 bg-amber-400 text-zinc-900 font-bold rounded-xl hover:bg-amber-500 transition-all shadow-lg shadow-amber-900/20 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      task ? "Salvar" : "Criar Tarefa"
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      <TagModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        existingTags={availableTags}
        onTagCreated={(newTag) => {
          setAvailableTags(prev => [...prev, newTag]);
          setSelectedTagIds(prev => [...prev, newTag._id]);
        }}
      />
    </>
  );
}
