import React, { useState } from 'react';
import { Car, LogOut, Shield, Bell, Home, Navigation, Calendar, User } from 'lucide-react';
import { User as UserType, AppNotification } from '../types';
import { NotificationDropdown } from './NotificationDropdown';

interface NavbarProps {
  currentUser: UserType | null;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onLogout: () => void;
  onOpenAuth: () => void;
  notifications: AppNotification[];
  onMarkAllNotifsRead: () => void;
  onClearAllNotifs: () => void;
  onNotificationClick: (notif: AppNotification) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentTab,
  setCurrentTab,
  onLogout,
  onOpenAuth,
  notifications,
  onMarkAllNotifsRead,
  onClearAllNotifs,
  onNotificationClick,
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Relevant notifications filter
  const relevantNotifications = notifications.filter((n) => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    return n.targetRole === 'customer' && (!n.userId || n.userId === currentUser.id);
  });

  const unreadCount = relevantNotifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Brand Logo */}
            <div
              className="flex items-center space-x-2.5 cursor-pointer select-none"
              onClick={() => setCurrentTab('home')}
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-sm flex-shrink-0">
                <Car className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-black tracking-tight text-orange-600 block leading-tight">
                  Bihar Cabs
                </span>
                <span className="block text-[10.5px] sm:text-xs text-gray-500 font-medium tracking-wide truncate max-w-[150px] sm:max-w-none">
                  District travel made easy
                </span>
              </div>
            </div>

            {/* Desktop Navigation Items */}
            <div className="hidden md:flex items-center space-x-1">
              <button
                onClick={() => setCurrentTab('home')}
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  currentTab === 'home'
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-orange-600'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentTab('vehicles')}
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  currentTab === 'vehicles'
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-orange-600'
                }`}
              >
                Fleet & Catalog
              </button>
              <button
                onClick={() => setCurrentTab('book')}
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  currentTab === 'book'
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-orange-600'
                }`}
              >
                Book a Ride
              </button>

              {currentUser && (
                <button
                  onClick={() => setCurrentTab('my-bookings')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    currentTab === 'my-bookings'
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-orange-600'
                  }`}
                >
                  My Bookings
                </button>
              )}

              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => setCurrentTab('admin')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                    currentTab === 'admin'
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'text-orange-700 bg-orange-50 hover:bg-orange-100'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" /> Admin Panel
                </button>
              )}
            </div>

            {/* Right Section: Notifications & Profile */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Notification Bell */}
              {currentUser && (
                <div className="relative">
                  <button
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition border border-gray-100 relative cursor-pointer"
                    title="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {isNotifOpen && (
                    <NotificationDropdown
                      notifications={relevantNotifications}
                      onMarkAllAsRead={onMarkAllNotifsRead}
                      onClearAll={onClearAllNotifs}
                      onNotificationClick={(notif) => {
                        onNotificationClick(notif);
                        setIsNotifOpen(false);
                      }}
                      onClose={() => setIsNotifOpen(false)}
                    />
                  )}
                </div>
              )}

              {/* User Profile / Sign In */}
              {currentUser ? (
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-xs sm:text-sm font-bold text-gray-800 leading-tight">
                      {currentUser.name}
                    </span>
                    <span className="text-[11px] text-orange-600 font-medium flex items-center gap-1 select-none">
                      {currentUser.role === 'admin' ? (
                        <>
                          <Shield className="w-3 h-3" /> Admin
                        </>
                      ) : (
                        'Customer'
                      )}
                    </span>
                  </div>

                  <button
                    onClick={onLogout}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition duration-150 border border-gray-100 hover:border-red-100 cursor-pointer"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="inline-flex items-center gap-1 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-orange-600 to-amber-500 rounded-xl hover:from-orange-700 hover:to-amber-600 shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar (Native App Style) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl py-1.5 px-3 flex justify-around items-center select-none">
        <button
          onClick={() => setCurrentTab('home')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition cursor-pointer ${
            currentTab === 'home'
              ? 'text-orange-600 font-black'
              : 'text-slate-500 font-medium hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        <button
          onClick={() => setCurrentTab('vehicles')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition cursor-pointer ${
            currentTab === 'vehicles'
              ? 'text-orange-600 font-black'
              : 'text-slate-500 font-medium hover:text-slate-800'
          }`}
        >
          <Car className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Fleet</span>
        </button>

        <button
          onClick={() => setCurrentTab('book')}
          className="flex flex-col items-center -mt-4 py-1 px-2 transition cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/40 group-hover:scale-105 transition">
            <Navigation className="w-5 h-5" />
          </div>
          <span
            className={`text-[10px] font-black mt-0.5 ${
              currentTab === 'book' ? 'text-orange-600' : 'text-slate-600'
            }`}
          >
            Book Ride
          </span>
        </button>

        {currentUser ? (
          <button
            onClick={() => setCurrentTab('my-bookings')}
            className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition cursor-pointer ${
              currentTab === 'my-bookings'
                ? 'text-orange-600 font-black'
                : 'text-slate-500 font-medium hover:text-slate-800'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Bookings</span>
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex flex-col items-center py-1 px-2.5 rounded-xl transition cursor-pointer text-slate-500 font-medium hover:text-slate-800"
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Sign In</span>
          </button>
        )}

        {currentUser?.role === 'admin' && (
          <button
            onClick={() => setCurrentTab('admin')}
            className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition cursor-pointer ${
              currentTab === 'admin'
                ? 'text-orange-600 font-black'
                : 'text-slate-500 font-medium hover:text-slate-800'
            }`}
          >
            <Shield className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Admin</span>
          </button>
        )}
      </div>
    </>
  );
};
