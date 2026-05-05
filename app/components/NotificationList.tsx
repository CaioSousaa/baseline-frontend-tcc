"use client";

import { useState, useEffect } from "react";
import { Bell, Check, Trash2, X, Loader2 } from "lucide-react";
import { api } from "@/lib/axios";
import { Notification } from "../types";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface NotificationListProps {
  onClose: () => void;
  onNotificationRead?: () => void;
}

export function NotificationList({ onClose, onNotificationRead }: NotificationListProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      setIsLoading(true);
      const response = await api.get("/notification/");
      setNotifications(response.data);
    } catch (err) {
      console.error("Erro ao carregar notificações:", err);
      setError("Não foi possível carregar as notificações.");
    } finally {
      setIsLoading(false);
    }
  }

  async function markAsRead(id: string) {
    try {
      await api.patch(`/notification/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      );
      if (onNotificationRead) onNotificationRead();
    } catch (err) {
      console.error("Erro ao marcar como lida:", err);
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-zinc-100">Notificações</h3>
          {unreadCount > 0 && (
            <span className="bg-amber-400 text-zinc-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="p-8 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <p className="text-sm font-medium">Carregando...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500 text-sm font-medium">
            {error}
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 flex flex-col items-center justify-center gap-3 text-zinc-600 text-center">
            <div className="p-4 bg-zinc-800 rounded-full">
              <Bell className="w-8 h-8 opacity-20" />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-100">Tudo limpo por aqui!</p>
              <p className="text-xs">Você não tem novas notificações.</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 transition-colors hover:bg-zinc-800/50 relative group ${!notification.read ? 'bg-amber-400/[0.03]' : ''}`}
              >
                {!notification.read && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400" />
                )}

                <div className="flex gap-3">
                  <div className={`mt-1 p-2 rounded-lg flex-shrink-0 ${!notification.read ? 'bg-amber-400/10 text-amber-400' : 'bg-zinc-800 text-zinc-500'}`}>
                    <Bell className="w-4 h-4" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[10px] text-amber-400 font-bold uppercase truncate">
                        {notification.task.title}
                      </p>
                    </div>
                    <p className={`text-sm leading-snug ${!notification.read ? 'text-zinc-100 font-bold' : 'text-zinc-400'}`}>
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-zinc-500 font-medium">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: ptBR })}
                    </p>
                  </div>

                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification._id)}
                      className="p-1.5 h-fit text-amber-400 hover:bg-amber-400/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      title="Marcar como lida"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="p-3 border-t border-zinc-800 bg-zinc-900/30 text-center">
          <button
            className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-amber-400 transition-all"
            onClick={fetchNotifications}
          >
            Sincronizar Agora
          </button>
        </div>
      )}
    </div>
  );
}
