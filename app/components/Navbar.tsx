"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { RxGear } from "react-icons/rx";
import { CiLogout } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { NotificationList } from "./NotificationList";
import { UserModal } from "./UserModal";
import { api } from "@/lib/axios";
import { Notification } from "../types";

export function Navbar() {
  const router = useRouter();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  async function fetchUnreadCount() {
    try {
      const response = await api.get("/notification/");
      const data: Notification[] = response.data;
      const unread = data.filter((n) => !n.read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Erro ao carregar notificações no Navbar:", err);
    }
  }

  function handleLogout() {
    localStorage.removeItem("@baseline:token");
    router.push("/login");
  }

  return (
    <nav className="h-[80px] w-full flex items-center justify-between px-8 bg-amber-400 border-b border-amber-500 shadow-xl sticky top-0 z-50">
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

      <div className="flex items-center gap-3 relative">
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={`p-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center ${isNotificationsOpen ? 'text-zinc-900' : 'text-zinc-900/80 hover:text-zinc-900'}`}
            title="Notificações"
          >
            <IoIosNotificationsOutline className={`w-8 h-8 transition-transform ${isNotificationsOpen ? 'scale-110' : 'hover:scale-110'}`} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-4 h-4 bg-zinc-900 text-amber-400 text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-amber-400">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <NotificationList
              onClose={() => setIsNotificationsOpen(false)}
              onNotificationRead={fetchUnreadCount}
            />
          )}
        </div>

        <button
          onClick={() => setIsUserModalOpen(true)}
          className="p-2.5 text-zinc-900/80 hover:text-zinc-900 transition-all cursor-pointer flex items-center justify-center group"
          title="Configurações"
        >
          <RxGear className="w-8 h-8 transition-transform group-hover:rotate-45" />
        </button>

        <button
          onClick={handleLogout}
          className="p-2.5 text-zinc-900/80 hover:text-red-700 transition-all cursor-pointer flex items-center justify-center group"
          title="Sair"
        >
          <CiLogout className="w-8 h-8 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
      />
    </nav>
  );
}
