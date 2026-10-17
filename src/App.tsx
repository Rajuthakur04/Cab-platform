import { useState, useEffect } from 'react';
import { VEHICLES, INITIAL_BOOKINGS, INITIAL_NOTIFICATIONS, DISTRICTS } from './data/mockData';
import { User, Vehicle, Booking, AppNotification } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { VehicleCatalog } from './components/VehicleCatalog';
import { BookingForm } from './components/BookingForm';
import { MyBookings } from './components/MyBookings';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { InvoiceModal } from './components/InvoiceModal';
import { Footer } from './components/Footer';
import { FloatingContactWidget } from './components/FloatingContactWidget';
import { Shield, ArrowRight, Bell, X } from 'lucide-react';

export default function App() {
  // Read initial tab from URL pathname (e.g. /admin opens Admin)
  const getInitialTab = (): string => {
    const path = window.location.pathname.replace(/^\//, '').toLowerCase();
    if (path === 'admin') return 'admin';
    if (path === 'book') return 'book';
    if (path === 'vehicles') return 'vehicles';
    if (path === 'my-bookings') return 'my-bookings';
    return 'home';
  };

  const [currentTab, setCurrentTab] = useState<string>(getInitialTab);

  // Authenticated state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('bihar_cabs_current_user');
    if (savedUser) return JSON.parse(savedUser);
    // If URL is /admin, default to Admin user
    if (window.location.pathname.toLowerCase().includes('admin')) {
      return {
        id: 'admin1',
        name: 'Admin Bihar Cabs',
        email: 'admin@biharcabs.in',
        phone: '9876543210',
        role: 'admin',
      };
    }
    return null;
  });

  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  // Bookings state
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const savedBookings = localStorage.getItem('bihar_cabs_bookings');
    return savedBookings ? JSON.parse(savedBookings) : INITIAL_BOOKINGS;
  });

  // Vehicles state with real image migration
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const savedVehicles = localStorage.getItem('bihar_cabs_vehicles');
    if (!savedVehicles) return VEHICLES;
    try {
      const parsed: Vehicle[] = JSON.parse(savedVehicles);
      return parsed.map((v) => {
        const matching = VEHICLES.find((m) => m.id === v.id);
        // Replace old unsplash images with real car photos
        if (matching && (v.image.includes('unsplash.com') || !v.image.startsWith('/cars/'))) {
          return { ...v, image: matching.image };
        }
        return v;
      });
    } catch {
      return VEHICLES;
    }
  });

  // Notifications state
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const savedNotifs = localStorage.getItem('bihar_cabs_notifications');
    return savedNotifs ? JSON.parse(savedNotifs) : INITIAL_NOTIFICATIONS;
  });

  // Toast notification state for live booking pops
  const [liveToast, setLiveToast] = useState<{ title: string; message: string } | null>(null);

  // Invoice Modal state
  const [invoiceBooking, setInvoiceBooking] = useState<Booking | null>(null);

  // Keep URL synced with current tab (e.g. /admin)
  useEffect(() => {
    const path = currentTab === 'home' ? '/' : `/${currentTab}`;
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
  }, [currentTab]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\//, '').toLowerCase();
      if (path === 'admin') setCurrentTab('admin');
      else if (path === 'book') setCurrentTab('book');
      else if (path === 'vehicles') setCurrentTab('vehicles');
      else if (path === 'my-bookings') setCurrentTab('my-bookings');
      else setCurrentTab('home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // When visiting /admin, ensure user is set as admin
  useEffect(() => {
    if (currentTab === 'admin' && currentUser?.role !== 'admin') {
      setCurrentUser({
        id: 'admin1',
        name: 'Admin Bihar Cabs',
        email: 'admin@biharcabs.in',
        phone: '9876543210',
        role: 'admin',
      });
    }
  }, [currentTab, currentUser]);

  // Keep localStorage synced
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('bihar_cabs_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('bihar_cabs_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('bihar_cabs_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('bihar_cabs_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('bihar_cabs_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentTab('home');
  };

  const handleAdminLoginClick = () => {
    setCurrentUser({
      id: 'admin1',
      name: 'Admin Bihar Cabs',
      email: 'admin@biharcabs.in',
      phone: '9876543210',
      role: 'admin',
    });
    setCurrentTab('admin');
  };

  const handleCancelBooking = (id: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'Cancelled' } : b))
      );

      const cancelNotif: AppNotification = {
        id: 'notif_' + Math.random().toString(36).substr(2, 9),
        title: 'Booking Cancelled',
        message: `Booking #${id.slice(0, 8)} was cancelled by user.`,
        type: 'booking_status',
        bookingId: id,
        read: false,
        createdAt: new Date().toISOString(),
        targetRole: 'admin',
      };
      setNotifications((prev) => [cancelNotif, ...prev]);
    }
  };

  const handleBookingCreated = (newBooking: Booking) => {
    const pickupName = DISTRICTS.find((d) => d.id === newBooking.pickupDistrictId)?.name || newBooking.pickupDistrictId;
    const dropoffName =
      newBooking.bookingType === 'local'
        ? `Local Rental (${newBooking.localDurationHours}h)`
        : DISTRICTS.find((d) => d.id === newBooking.dropoffDistrictId)?.name || newBooking.dropoffDistrictId;

    const notif: AppNotification = {
      id: 'notif_' + Math.random().toString(36).substr(2, 9),
      title: '🚖 New Ride Booking Received',
      message: `${newBooking.userName} booked ${pickupName} ➔ ${dropoffName} (₹${newBooking.totalFare})`,
      type: 'booking_new',
      bookingId: newBooking.id,
      read: false,
      createdAt: new Date().toISOString(),
      targetRole: 'admin',
    };

    setNotifications((prev) => [notif, ...prev]);

    // Show live floating toast
    setLiveToast({
      title: notif.title,
      message: notif.message,
    });

    setTimeout(() => {
      setLiveToast(null);
    }, 6000);
  };

  const handleNotificationClick = (notif: AppNotification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );

    if (currentUser?.role === 'admin') {
      setCurrentTab('admin');
    } else {
      setCurrentTab('my-bookings');
    }
  };

  const handleMarkAllNotifsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAllNotifs = () => {
    setNotifications([]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 antialiased font-sans">
      {/* Top Banner when an Admin is viewing as Customer */}
      {currentUser?.role === 'admin' && currentTab !== 'admin' && (
        <div className="bg-amber-500 text-amber-950 px-4 py-2 text-xs font-bold flex justify-between items-center shadow-xs">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-amber-900" />
              Viewing as Customer (Admin: {currentUser.name})
            </span>
            <button
              onClick={() => setCurrentTab('admin')}
              className="bg-slate-900 text-white px-3 py-1 rounded-lg text-xs font-black hover:bg-black transition flex items-center gap-1 cursor-pointer"
            >
              Back to Admin Panel
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentUser={currentUser}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onLogout={handleLogout}
        onOpenAuth={() => setAuthModalOpen(true)}
        notifications={notifications}
        onMarkAllNotifsRead={handleMarkAllNotifsRead}
        onClearAllNotifs={handleClearAllNotifs}
        onNotificationClick={handleNotificationClick}
      />

      {/* Floating Live Toast for New Bookings / Alerts */}
      {liveToast && (
        <div className="fixed top-20 right-4 z-50 max-w-sm bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 animate-in slide-in-from-top-4 flex items-start gap-3">
          <div className="p-2 bg-orange-600 rounded-xl flex-shrink-0">
            <Bell className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-black text-orange-400">{liveToast.title}</h4>
            <p className="text-xs text-slate-200 mt-0.5 leading-snug">{liveToast.message}</p>
            {currentUser?.role === 'admin' && currentTab !== 'admin' && (
              <button
                onClick={() => {
                  setCurrentTab('admin');
                  setLiveToast(null);
                }}
                className="mt-2 text-[11px] font-bold text-orange-400 hover:text-orange-300 underline block"
              >
                View in Admin Panel ➔
              </button>
            )}
          </div>
          <button
            onClick={() => setLiveToast(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Primary content router */}
      <main className="flex-1 bg-gradient-to-b from-white via-orange-50/20 to-slate-50 pb-20 md:pb-0">
        {currentTab === 'home' && (
          <Hero
            setCurrentTab={setCurrentTab}
            onOpenAuth={() => setAuthModalOpen(true)}
            isLoggedIn={currentUser !== null}
          />
        )}

        {currentTab === 'vehicles' && (
          <VehicleCatalog vehicles={vehicles} setCurrentTab={setCurrentTab} />
        )}

        {currentTab === 'book' && (
          <BookingForm
            currentUser={currentUser}
            onOpenAuth={() => setAuthModalOpen(true)}
            setBookings={setBookings}
            vehicles={vehicles}
            onBookingCreated={handleBookingCreated}
            setCurrentTab={setCurrentTab}
            onViewInvoice={(booking) => setInvoiceBooking(booking)}
          />
        )}

        {currentTab === 'my-bookings' && currentUser && (
          <MyBookings
            userId={currentUser.id}
            bookings={bookings}
            vehicles={vehicles}
            onCancelBooking={handleCancelBooking}
            onViewInvoice={(booking) => setInvoiceBooking(booking)}
            onBookRideClick={() => setCurrentTab('book')}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard
            bookings={bookings}
            setBookings={setBookings}
            vehicles={vehicles}
            setVehicles={setVehicles}
            notifications={notifications}
            setNotifications={setNotifications}
            onViewInvoice={(booking) => setInvoiceBooking(booking)}
            onSwitchToUserView={() => setCurrentTab('book')}
          />
        )}
      </main>

      <Footer setCurrentTab={setCurrentTab} onAdminLoginClick={handleAdminLoginClick} />

      {/* Authentication Modal */}
      {authModalOpen && (
        <AuthModal
          onClose={() => setAuthModalOpen(false)}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            if (user.role === 'admin') {
              setCurrentTab('admin');
            }
          }}
        />
      )}

      {/* Invoice & Receipt Modal */}
      {invoiceBooking && (
        <InvoiceModal
          booking={invoiceBooking}
          vehicle={vehicles.find((v) => v.id === invoiceBooking.vehicleId)}
          onClose={() => setInvoiceBooking(null)}
        />
      )}

      {/* Site-wide Floating WhatsApp & Call Widget (Only for customer view, hidden in Admin Dashboard) */}
      {currentTab !== 'admin' && (
        <FloatingContactWidget phoneNumber="9308874698" />
      )}
    </div>
  );
}
