"use client";

import { useEffect, useState, useCallback } from "react";
import { Navbar } from "./components/Navbar";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Filter,
  Plus,
  Loader2
} from "lucide-react";
import { TaskModal } from "./components/TaskModal";
import { StatCard } from "./components/StatCard";
import { Column } from "./components/Column";
import { Tag, Task } from "./types";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const router = useRouter();

  const fetchData = useCallback(async () => {
    try {
      const [tasksRes, tagsRes] = await Promise.all([
        api.get("/task/"),
        api.get("/tag/"),
      ]);
      setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : []);
      setAllTags(Array.isArray(tagsRes.data) ? tagsRes.data : []);
    } catch (err: unknown) {
      console.error("Erro ao carregar dados:", err);
      setError("Não foi possível carregar seus dados. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("@baseline:token");
    if (!token) {
      router.push("/login");
      return;
    }

    void fetchData();
  }, [router, fetchData]);

  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    if (priorityWeight[b.priority] !== priorityWeight[a.priority]) {
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    }
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const tasksByStatus = {
    todo: sortedTasks.filter(t => t.status === "todo"),
    in_progress: sortedTasks.filter(t => t.status === "in_progress"),
    done: sortedTasks.filter(t => t.status === "done"),
  };

  const handleOpenTaskModal = (task: Task | null = null) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  if (isLoading && tasks.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-slate-500 font-medium">Carregando tarefas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Meu Painel</h1>
            <p className="text-slate-500">Gerencie suas tarefas e acompanhe seu progresso.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <Filter className="w-4 h-4" />
              <span>Filtrar</span>
            </button>
            <button
              onClick={() => handleOpenTaskModal(null)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Tarefa</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-8 flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard
            title="A Fazer"
            count={tasksByStatus.todo.length}
            icon={<ClipboardList className="w-6 h-6 text-blue-600" />}
            color="bg-blue-50"
          />
          <StatCard
            title="Em Progresso"
            count={tasksByStatus.in_progress.length}
            icon={<Clock className="w-6 h-6 text-amber-600" />}
            color="bg-amber-50"
          />
          <StatCard
            title="Concluído"
            count={tasksByStatus.done.length}
            icon={<CheckCircle2 className="w-6 h-6 text-emerald-600" />}
            color="bg-emerald-50"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <Column title="Para Fazer" tasks={tasksByStatus.todo} status="todo" onTaskClick={handleOpenTaskModal} allTags={allTags} />
          <Column title="Em Andamento" tasks={tasksByStatus.in_progress} status="in_progress" onTaskClick={handleOpenTaskModal} allTags={allTags} />
          <Column title="Finalizado" tasks={tasksByStatus.done} status="done" onTaskClick={handleOpenTaskModal} allTags={allTags} />
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskSaved={fetchData}
        task={selectedTask}
      />
    </main>
  );
}
