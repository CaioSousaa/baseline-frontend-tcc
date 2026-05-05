"use client";

import { Tag, Task } from "../types";
import { TaskCard } from "./TaskCard";

interface ColumnProps {
  title: string;
  tasks: Task[];
  status: string;
  onTaskClick: (task: Task) => void;
  allTags: Tag[];
}

export function Column({ title, tasks, status, onTaskClick, allTags }: ColumnProps) {
  const statusColors = {
    todo: "bg-zinc-500",
    in_progress: "bg-amber-400",
    done: "bg-emerald-400",
  };

  const highCount = tasks.filter(t => t.priority === 'high').length;
  const mediumCount = tasks.filter(t => t.priority === 'medium').length;
  const lowCount = tasks.filter(t => t.priority === 'low').length;

  return (
    <div className="flex flex-col bg-zinc-900/40 rounded-2xl border border-zinc-800/50 overflow-hidden shadow-inner backdrop-blur-sm h-full">
      {/* Header Section */}
      <div className="p-5 border-b border-zinc-800/80 bg-zinc-900/60">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="font-black text-zinc-100 uppercase text-[11px] tracking-[0.2em]">{title}</h2>
              <p className="text-[10px] text-zinc-500 font-bold uppercase mt-0.5">{tasks.length} tarefas no total</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 bg-zinc-950/40 p-2 rounded-lg border border-zinc-800/30">
          <div className="flex flex-col items-center flex-1">
            <span className="text-[9px] font-black text-red-500/80 uppercase tracking-tighter">Alta</span>
            <span className="text-xs font-bold text-zinc-100">{highCount}</span>
          </div>
          <div className="w-px h-6 bg-zinc-800/50" />
          <div className="flex flex-col items-center flex-1">
            <span className="text-[9px] font-black text-amber-400/80 uppercase tracking-tighter">Média</span>
            <span className="text-xs font-bold text-zinc-100">{mediumCount}</span>
          </div>
          <div className="w-px h-6 bg-zinc-800/50" />
          <div className="flex flex-col items-center flex-1">
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-tighter">Baixa</span>
            <span className="text-xs font-bold text-zinc-100">{lowCount}</span>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-1 flex flex-col gap-4 p-4 min-h-[600px] max-h-[800px] overflow-y-auto custom-scrollbar">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} onClick={() => onTaskClick(task)} allTags={allTags} />
        ))}
        {tasks.length === 0 && (
          <div className="border-2 border-dashed border-zinc-800/40 rounded-xl p-10 flex flex-col items-center justify-center text-zinc-600/50 text-center">
            <p className="text-xs font-bold uppercase tracking-widest italic">Vazio</p>
          </div>
        )}
      </div>
    </div>
  );
}
