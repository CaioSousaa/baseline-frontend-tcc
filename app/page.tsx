"use client";

import { useEffect, useState } from "react";
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

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  tags: Array<{ _id: string; name: string; color: string }>;
}

const priorityColors = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-blue-100 text-blue-700 border-blue-200",
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("@baseline:token");
    if (!token) {
      router.push("/login");
      return;
    }

    async function fetchTasks() {
      try {
        setIsLoading(true);
        const response = await api.get("/task/");
        setTasks(response.data);
      } catch (err: any) {
        console.error("Erro ao carregar tarefas:", err);
        setError("Não foi possível carregar suas tarefas. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTasks();
  }, [router]);

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

  if (isLoading) {
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
        {/* Header Section */}
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
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm font-medium">
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

        {/* Stats Grid - RF19 */}
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

        {/* Kanban Board - RF12 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <Column title="Para Fazer" tasks={tasksByStatus.todo} status="todo" />
          <Column title="Em Andamento" tasks={tasksByStatus.in_progress} status="in_progress" />
          <Column title="Finalizado" tasks={tasksByStatus.done} status="done" />
        </div>
      </div>
    </main>
  );
}

function StatCard({ title, count, icon, color }: { title: string; count: number; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{count}</p>
      </div>
    </div>
  );
}

function Column({ title, tasks, status }: { title: string; tasks: Task[]; status: string }) {
  const statusColors = {
    todo: "bg-blue-600",
    in_progress: "bg-amber-500",
    done: "bg-emerald-500",
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-6 rounded-full ${statusColors[status as keyof typeof statusColors]}`} />
          <h2 className="font-semibold text-slate-800 uppercase text-sm tracking-wide">{title}</h2>
          <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>
      
      <div className="flex flex-col gap-4 min-h-[500px]">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
        {tasks.length === 0 && (
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400">
            <p className="text-sm">Nenhuma tarefa aqui</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
      <div className="flex justify-between items-start mb-3">
        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
          {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
        </span>
        <div className="flex gap-1">
          {task.tags && task.tags.map((tag: any) => (
            <span key={tag._id} className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }} title={tag.name} />
          ))}
        </div>
      </div>
      
      <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
        {task.title}
      </h3>
      
      <p className="text-sm text-slate-500 line-clamp-2 mb-4">
        {task.description}
      </p>
      
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Calendar className="w-3.5 h-3.5" />
          <span className="text-xs">{new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>
        </div>
        
        {task.priority === 'high' && (
          <AlertCircle className="w-4 h-4 text-red-500" />
        )}
      </div>
    </div>
  );
}
