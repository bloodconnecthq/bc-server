"use client"

import { NotificationsList } from "@/components/donor/notifications-list";
import { useAuth } from "../../providers/auth-provider";
import { useNotifications } from "@/lib/hooks/useNotifications";
import { markAllNotificationsAsRead } from "@/lib/api/notificationApi";
import { useState } from "react";

export default function NotificationsPage() {
  const { token, isLoading: authLoading } = useAuth();
  const { notifications, isLoading, error, refetch } = useNotifications(token);
  const [markingAll, setMarkingAll] = useState(false);

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Chargement des notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600">Erreur: {error}</p>
      </div>
    );
  }

  const unread = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = async () => {
    if (!token || markingAll) return;
    setMarkingAll(true);
    try {
      await markAllNotificationsAsRead(token);
      await refetch();
    } catch {
      // silent — UI still refreshes on next load
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <div className="space-y-6 max-">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            {unread > 0
              ? `${unread} notification${unread > 1 ? "s" : ""} non lue${unread > 1 ? "s" : ""}`
              : "Tout est à jour"}
          </p>
        </div>
        {unread > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={markingAll}
            className="text-xs text-red-600 font-medium hover:underline disabled:opacity-50"
          >
            {markingAll ? "Mise à jour..." : "Tout marquer comme lu"}
          </button>
        )}
      </div>

      <NotificationsList notifications={notifications} token={token} />
    </div>
  );
}
