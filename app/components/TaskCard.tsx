"use client";

import { Calendar, AlertCircle } from "lucide-react";
import { Tag, Task } from "../types";

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  allTags: Tag[];
}

const priorityColors = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-blue-100 text-blue-700 border-blue-200",
};

export function TaskCard({ task, onClick, allTags }: TaskCardProps) {
  const taskTags = task.tags.map(t => {
    if (typeof t === 'string') {
      return allTags.find(at => at._id === t);
    }
    return t;
  }).filter(Boolean) as Tag[];

  return (
    <div
      onClick={onClick}
      className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-3">
        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
          {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
        </span>
      </div>

      <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
        {task.title}
      </h3>

      <p className="text-sm text-slate-500 line-clamp-2 mb-4">
        {task.description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-xs">{new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>
          </div>

          <div className="flex gap-1.5 flex-wrap">
            {taskTags.map((tag) => (
              <div
                key={tag._id}
                className="px-2 py-0.5 rounded-xl shadow-sm text-white text-[10px] font-bold"
                style={{ backgroundColor: tag.color }}
              >
                {tag.name}
              </div>
            ))}
          </div>
        </div>

        {task.priority === 'high' && (
          <AlertCircle className="w-4 h-4 text-red-500" />
        )}
      </div>
    </div>
  );
}
