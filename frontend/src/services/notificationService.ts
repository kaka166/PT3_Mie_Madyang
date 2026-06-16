import Swal from "sweetalert2";

export type NotifType = "success" | "error" | "warning" | "info";
export type NotifSource = "admin" | "cashier" | "kitchen";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotifType;
  source: NotifSource;
  timestamp: number;
  read: boolean;
}

const SOURCE_ROLES: Record<NotifSource, number[]> = {
  admin: [1],
  cashier: [1, 2],
  kitchen: [1, 2, 3],
};

const NOTIF_KEY = "app_notifications";
const MAX_NOTIFS = 50;

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", () => Swal.stopTimer());
    toast.addEventListener("mouseleave", () => Swal.resumeTimer());
  },
});

export function showToast(
  title: string,
  type: NotifType = "info",
  duration?: number
) {
  const durations: Record<NotifType, number> = {
    success: 4000,
    info: 4000,
    warning: 6000,
    error: 8000,
  };

  Toast.fire({
    icon: type,
    title,
    timer: duration ?? durations[type],
  });
}

function getNotifications(): AppNotification[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(NOTIF_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveNotifications(list: AppNotification[]) {
  localStorage.setItem(NOTIF_KEY, JSON.stringify(list));
}

export function addNotification(
  title: string,
  message: string,
  type: NotifType = "info",
  silent?: boolean,
  source: NotifSource = "admin"
) {
  const notif: AppNotification = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
    title,
    message,
    type,
    source,
    timestamp: Date.now(),
    read: false,
  };

  const list = [notif, ...getNotifications()].slice(0, MAX_NOTIFS);
  saveNotifications(list);

  return notif;
}

export function getUnreadCount(): number {
  return getNotifications().filter((n) => !n.read).length;
}

export function getAllNotifications(): AppNotification[] {
  return getNotifications();
}

export function getNotificationsByRole(roleId: number): AppNotification[] {
  const allowedSources = (Object.entries(SOURCE_ROLES) as [NotifSource, number[]][])
    .filter(([, roles]) => roles.includes(roleId))
    .map(([source]) => source);
  return getNotifications().filter((n) => allowedSources.includes(n.source));
}

export function getUnreadCountByRole(roleId: number): number {
  return getNotificationsByRole(roleId).filter((n) => !n.read).length;
}

export function markAsRead(id: string) {
  const list = getNotifications();
  const found = list.find((n) => n.id === id);
  if (found) {
    found.read = true;
    saveNotifications(list);
  }
}

export function markAllAsRead() {
  const list = getNotifications();
  list.forEach((n) => (n.read = true));
  saveNotifications(list);
}

export function clearNotifications() {
  localStorage.removeItem(NOTIF_KEY);
}
