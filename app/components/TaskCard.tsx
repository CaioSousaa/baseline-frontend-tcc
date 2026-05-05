"use client";

import { Calendar } from "lucide-react";
import { Tag, Task } from "../types";

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  allTags: Tag[];
}



export function TaskCard({ task, onClick, allTags }: TaskCardProps) {
  const taskTags = (task.tags || []).map(t => {
    const tagId = typeof t === 'string' ? t : (t as Tag)._id;
    return allTags.find(at => at._id === tagId) || (typeof t !== 'string' ? t : null);
  }).filter(Boolean) as Tag[];

  return (
    <div
      onClick={onClick}
      className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 shadow-lg hover:shadow-amber-900/5 hover:border-zinc-700 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-bold text-zinc-100 group-hover:text-amber-400 transition-colors">
          {task.title}
        </h3>
        <span className="text-[10px] font-bold text-zinc-200 uppercase tracking-wider shrink-0 mt-1">
          {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
        </span>
      </div>

      <p className="text-xs text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
        {task.description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-zinc-800 mt-auto">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-zinc-500">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold">{new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>
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

      </div>
    </div>
  );
}
