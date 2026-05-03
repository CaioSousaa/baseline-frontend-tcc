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
          <TaskCard key={task._id} task={task} onClick={() => onTaskClick(task)} allTags={allTags} />
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
