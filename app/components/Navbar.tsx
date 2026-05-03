"use client";

import Image from "next/image";
import { Settings, Bell, DoorOpen } from "lucide-react";
import { useRouter } from "next/navigation";

export function Navbar() {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("@baseline:token");
    router.push("/login");
  }

  return (
    <nav className="h-[80px] w-full flex items-center justify-between px-8 bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="flex items-center">
        <Image 
          src="/logo.png" 
          alt="Logo" 
          width={180} 
          height={60} 
          className="h-12 w-auto object-contain"
          priority
        />
      </div>

      <div className="flex items-center gap-3">
        <button 
          className="p-2.5 text-slate-500 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-all cursor-pointer flex items-center justify-center"
          title="Notificações"
        >
          <Bell className="w-6 h-6" />
        </button>
        
        <button 
          className="p-2.5 text-slate-500 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-all cursor-pointer flex items-center justify-center"
          title="Configurações"
        >
          <Settings className="w-6 h-6" />
        </button>

        <button 
          onClick={handleLogout}
          className="p-2.5 text-slate-500 hover:bg-slate-50 hover:text-red-600 rounded-lg transition-all cursor-pointer flex items-center justify-center"
          title="Sair"
        >
          <DoorOpen className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
}
