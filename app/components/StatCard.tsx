"use client";

import React from "react";

interface StatCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

export function StatCard({ title, count, icon, color }: StatCardProps) {
  return (
    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-xl flex items-center gap-4 transition-all hover:border-zinc-700">
      <div className={`p-3 rounded-xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{title}</p>
        <p className="text-2xl font-bold text-zinc-100">{count}</p>
      </div>
    </div>
  );
}
