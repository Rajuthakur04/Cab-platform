import React, { useRef, useEffect } from 'react';
import { AppNotification } from '../types';
import { Bell, CheckCheck, Trash2, Calendar, ExternalLink, X } from 'lucide-react';

interface NotificationDropdownProps {
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onNotificationClick: (notif: AppNotification) => void;
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  onMarkAllAsRead,
  onClearAll,
  onNotificationClick,
  onClose,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [onClose]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatTimeAgo = (isoString: string) => {
    try {
      const diffSecs = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
      if (diffSecs < 60) return 'Just now';
      if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
      if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
      return `${Math.floor(diffSecs / 86400)}d ago`;
    } catch {
      return 'Recently';
    }
  };

  return (
    <div
      ref={panelRef}
      className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-orange-600 text-white rounded-lg shadow-sm">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-800">Alerts & Notifications</h4>
            <p className="text-[11px] text-gray-500 font-medium">
              {unreadCount > 0 ? `${unreadCount} unread update${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-orange-600 hover:text-orange-700 font-bold px-2 py-1 rounded-lg hover:bg-orange-100/60 transition flex items-center gap-1"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Read all</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-30 text-orange-500" />
            <p className="text-xs font-bold text-gray-600">No notifications yet</p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              New ride bookings and status alerts will appear here in real time.
            </p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => onNotificationClick(notif)}
              className={`p-3.5 transition cursor-pointer flex gap-3 items-start ${
                notif.read ? 'bg-white hover:bg-gray-50' : 'bg-orange-50/40 hover:bg-orange-50/70'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  notif.read ? 'bg-transparent' : 'bg-orange-600 ring-2 ring-orange-200'
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-1">
                  <span className="text-xs font-bold text-slate-900 leading-tight">
                    {notif.title}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                    {formatTimeAgo(notif.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1 leading-snug break-words">
                  {notif.message}
                </p>
                {notif.bookingId && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-orange-600 font-bold mt-1.5 bg-orange-100/70 px-2 py-0.5 rounded-full">
                    <Calendar className="w-3 h-3" /> Booking #{notif.bookingId.slice(0, 10)}
                    <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-2.5 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs">
          <span className="text-[11px] text-gray-500 font-medium px-2">
            Bihar Cabs Live Dispatch
          </span>
          <button
            onClick={onClearAll}
            className="text-red-600 hover:text-red-700 font-bold px-2 py-1 rounded-lg hover:bg-red-50 transition flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" /> Clear history
          </button>
        </div>
      )}
    </div>
  );
};
