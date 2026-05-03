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
