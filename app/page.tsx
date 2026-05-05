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
import { FilterBar } from "./components/FilterBar";
import { Tag, Task } from "./types";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [activeFilters, setActiveFilters] = useState<{
    priority: string[];
    tags: string[];
  }>({
    priority: [],
    tags: [],
  });

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

    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [router, fetchData]);

  const filteredTasks = tasks.filter((task) => {
    const matchesPriority =
      activeFilters.priority.length === 0 || activeFilters.priority.includes(task.priority);
    const matchesTags =
      activeFilters.tags.length === 0 ||
      task.tags.some((t) => {
        const tagId = typeof t === "string" ? t : t._id;
        return activeFilters.tags.includes(tagId);
      });

    return matchesPriority && matchesTags;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
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
      <div className="min-h-screen flex flex-col bg-zinc-950">
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
    <main className="min-h-screen flex flex-col bg-zinc-950">
      <Navbar />

      <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">Meu Painel</h1>
            <p className="text-zinc-400">Gerencie suas tarefas e acompanhe seu progresso.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenTaskModal(null)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-400 text-zinc-900 rounded-lg hover:bg-amber-500 transition-all shadow-lg shadow-amber-900/20 font-bold"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Tarefa</span>
            </button>
          </div>
        </div>

        <FilterBar
          isOpen={true}
          onClose={() => { }}
          allTags={allTags}
          filters={activeFilters}
          onFilterChange={setActiveFilters}
        />

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8 flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <p className="font-medium">{error}</p>
          </div>
        )}


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
