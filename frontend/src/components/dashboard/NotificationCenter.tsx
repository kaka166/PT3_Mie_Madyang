"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, CheckCheck, Trash2, X, Clock } from "lucide-react";
import {
  getUnreadCountByRole,
  getNotificationsByRole,
  markAsRead,
  markAllAsRead,
  clearNotifications,
  type AppNotification,
} from "@/services/notificationService";
import { authService } from "@/services/authService";

const typeDots: Record<string, string> = {
  success: "bg-emerald-500",
  error: "bg-red-500",
  warning: "bg-amber-500",
  info: "bg-blue-500",
};

function formatTime(ts: number) {
  const diff = Date.now() - ts;
  if (diff < 60000) return "baru saja";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m lalu`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}j lalu`;
  return new Date(ts).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const roleId = authService.getRole();
  const [count, setCount] = useState(() => (roleId ? getUnreadCountByRole(roleId) : 0));
  const [notifs, setNotifs] = useState<AppNotification[]>(() => (roleId ? getNotificationsByRole(roleId) : []));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!roleId) return;
      setNotifs(getNotificationsByRole(roleId));
      setCount(getUnreadCountByRole(roleId));
    }, 2000);
    return () => clearInterval(interval);
  }, [roleId]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const refreshNotifs = () => {
    if (!roleId) return;
    setNotifs(getNotificationsByRole(roleId));
    setCount(getUnreadCountByRole(roleId));
  };

  const handleMarkRead = (id: string) => {
    markAsRead(id);
    refreshNotifs();
  };

  const handleMarkAll = () => {
    markAllAsRead();
    refreshNotifs();
  };

  const handleClear = () => {
    clearNotifications();
    refreshNotifs();
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => {
          setOpen((o) => !o);
          refreshNotifs();
        }}
        className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-full relative transition-colors"
      >
        <Bell size={20} />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white min-w-[18px] min-h-[18px]">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-[60]">
          <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-neutral-50 to-white">
            <h3 className="font-bold text-sm text-gray-700 flex items-center gap-2">
              <Bell size={16} />
              Notifikasi
              {count > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {count}
                </span>
              )}
            </h3>
            <div className="flex gap-1">
              {notifs.length > 0 && count > 0 && (
                <button
                  onClick={handleMarkAll}
                  className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  title="Tandai semua sudah dibaca"
                >
                  <CheckCheck size={16} />
                </button>
              )}
              {notifs.length > 0 && (
                <button
                  onClick={handleClear}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Hapus semua notifikasi"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifs.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <Bell size={32} className="mx-auto mb-2 text-gray-200" />
                <p className="text-sm font-medium">Belum ada notifikasi</p>
              </div>
            ) : (
              notifs.map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 border-b border-gray-50 transition-colors hover:bg-gray-50 cursor-pointer ${
                    !n.read ? "bg-blue-50/30" : ""
                  }`}
                  onClick={() => handleMarkRead(n.id)}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                        typeDots[n.type]
                      } ${n.read ? "opacity-30" : ""}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm ${
                          n.read ? "text-gray-600" : "text-gray-800 font-semibold"
                        }`}
                      >
                        {n.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                        {n.message}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Clock size={10} className="text-gray-300" />
                        <span className="text-[10px] text-gray-400">
                          {formatTime(n.timestamp)}
                        </span>
                      </div>
                    </div>
                    {!n.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
