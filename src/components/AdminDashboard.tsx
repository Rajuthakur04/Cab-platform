import React, { useState } from 'react';
import { Booking, BookingStatus, Vehicle, VehicleTier, AppNotification } from '../types';
import { DISTRICTS } from '../data/mockData';
import { DriverAssignmentModal } from './DriverAssignmentModal';
import {
  Trash2,
  Plus,
  Award,
  FileText,
  Car,
  Settings,
  Luggage,
  Navigation,
  Edit3,
  Bell,
  CheckCircle,
  Clock,
  UserCheck,
  Search,
  IndianRupee,
  Fuel,
  Printer,
  User,
  ArrowRight,
  TrendingUp,
  Calendar,
  X
} from 'lucide-react';

interface AdminDashboardProps {
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  vehicles: Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  notifications: AppNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
  onViewInvoice: (booking: Booking) => void;
  onSwitchToUserView: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  bookings,
  setBookings,
  vehicles,
  setVehicles,
  notifications,
  setNotifications,
  onViewInvoice,
  onSwitchToUserView,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'bookings' | 'fleet' | 'notifications' | 'analytics'>('bookings');

  // Modal / Form state for Add/Edit Vehicle
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);

  // Form Fields
  const [vName, setVName] = useState('');
  const [vTier, setVTier] = useState<VehicleTier>('Economy');
  const [vBase, setVBase] = useState(300);
  const [vPerKm, setVPerKm] = useState(11);
  const [vSeats, setVSeats] = useState(4);
  const [vLuggage, setVLuggage] = useState(2);
  const [vAC, setVAC] = useState(true);
  const [vAuto, setVAuto] = useState(false);
  const [vPlate, setVPlate] = useState('BR-01-XX-0000');
  const [vFuel, setVFuel] = useState<'CNG' | 'Diesel' | 'Petrol' | 'Electric'>('CNG');
  const [vImage, setVImage] = useState('/cars/scorpio.jpg');

  // Booking Filtering & Search
  const [bookingFilter, setBookingFilter] = useState<BookingStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Driver Assignment Modal State
  const [assigningBooking, setAssigningBooking] = useState<Booking | null>(null);

  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = bookingFilter === 'All' || b.status === bookingFilter;
    const matchesSearch =
      b.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.userPhone.includes(searchQuery) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Metrics & Status breakdown counts
  const pendingCount = bookings.filter((b) => b.status === 'Pending').length;
  const confirmedCount = bookings.filter((b) => b.status === 'Confirmed').length;
  const completedCount = bookings.filter((b) => b.status === 'Completed').length;
  const cancelledCount = bookings.filter((b) => b.status === 'Cancelled').length;

  const totalRevenue = bookings
    .filter((b) => b.status === 'Completed' || b.status === 'Confirmed')
    .reduce((sum, b) => sum + b.totalFare, 0);

  const activeRidesCount = confirmedCount;
  const pendingRidesCount = pendingCount;
  const availableCarsCount = vehicles.filter((v) => v.available).length;
  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const handleUpdateBookingStatus = (id: string, newStatus: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );

    // Notify customer about status change
    const targetBooking = bookings.find((b) => b.id === id);
    if (targetBooking) {
      const statusNotif: AppNotification = {
        id: 'notif_' + Math.random().toString(36).substr(2, 9),
        title: `Ride Status: ${newStatus}`,
        message: `Your booking #${id.slice(0, 8)} status updated to ${newStatus}.`,
        type: 'booking_status',
        bookingId: id,
        read: false,
        createdAt: new Date().toISOString(),
        targetRole: 'customer',
        userId: targetBooking.userId,
      };
      setNotifications((prev) => [statusNotif, ...prev]);
    }
  };

  const handleDeleteBooking = (id: string) => {
    if (window.confirm('Are you sure you want to delete this booking permanently?')) {
      setBookings((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const handleAssignDriver = (
    bookingId: string,
    driverInfo: { driverName: string; driverPhone: string; vehicleNumber: string; otp: string }
  ) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'Confirmed',
              driverName: driverInfo.driverName,
              driverPhone: driverInfo.driverPhone,
              vehicleNumber: driverInfo.vehicleNumber,
              otp: driverInfo.otp,
            }
          : b
      )
    );

    // Create Notification
    const newNotif: AppNotification = {
      id: 'notif_' + Math.random().toString(36).substr(2, 9),
      title: 'Driver Assigned & Ride Confirmed',
      message: `Driver ${driverInfo.driverName} (${driverInfo.driverPhone}) assigned with car ${driverInfo.vehicleNumber}. OTP: ${driverInfo.otp}`,
      type: 'driver_assigned',
      bookingId,
      read: false,
      createdAt: new Date().toISOString(),
      targetRole: 'customer',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Open edit modal / form with prefilled values
  const handleStartEditVehicle = (v: Vehicle) => {
    setEditingVehicleId(v.id);
    setVName(v.name);
    setVTier(v.tier);
    setVBase(v.baseFare);
    setVPerKm(v.perKmRate);
    setVSeats(v.seats);
    setVLuggage(v.luggage);
    setVAC(v.ac);
    setVAuto(v.transmission === 'Automatic');
    setVPlate(v.registrationNumber || 'BR-01-XX-0000');
    setVFuel(v.fuelType || 'CNG');
    setVImage(v.image);
    setIsAddVehicleOpen(true);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vName || vBase <= 0 || vPerKm <= 0) return;

    if (editingVehicleId) {
      // Update existing vehicle
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === editingVehicleId
            ? {
                ...v,
                name: vName,
                tier: vTier,
                baseFare: vBase,
                perKmRate: vPerKm,
                seats: vSeats,
                luggage: vLuggage,
                ac: vAC,
                transmission: vAuto ? 'Automatic' : 'Manual',
                registrationNumber: vPlate,
                fuelType: vFuel,
                image: vImage,
              }
            : v
        )
      );
    } else {
      // Add new vehicle
      const newVehicle: Vehicle = {
        id: 'v_' + Math.random().toString(36).substr(2, 6),
        name: vName,
        tier: vTier,
        baseFare: vBase,
        perKmRate: vPerKm,
        seats: vSeats,
        luggage: vLuggage,
        available: true,
        ac: vAC,
        transmission: vAuto ? 'Automatic' : 'Manual',
        registrationNumber: vPlate,
        fuelType: vFuel,
        image: vImage,
      };
      setVehicles((prev) => [newVehicle, ...prev]);
    }

    // Reset Form
    setIsAddVehicleOpen(false);
    setEditingVehicleId(null);
    setVName('');
    setVTier('Economy');
    setVBase(300);
    setVPerKm(11);
    setVSeats(4);
    setVLuggage(2);
    setVAC(true);
    setVAuto(false);
    setVPlate('BR-01-XX-0000');
    setVFuel('CNG');
  };

  const handleToggleVehicleAvailability = (id: string) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, available: !v.available } : v))
    );
  };

  const handleDeleteVehicle = (id: string) => {
    if (window.confirm('Delete this vehicle from inventory?')) {
      setVehicles((prev) => prev.filter((v) => v.id !== id));
    }
  };

  const handleMarkAllNotifsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Header: Sleek Enterprise Command Center */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900 border border-slate-800/80 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden mb-8">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-3.5 py-1 rounded-full text-xs font-bold text-orange-300 mb-3 select-none">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Bihar Cabs Central Operations Hub • 12 Districts Active</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-display text-white">
              Central Dispatch & <span className="text-orange-500">Fleet Console</span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-2xl font-normal leading-relaxed">
              Real-time booking dispatch, instant driver assignment, and live car inventory tracking across Bihar state network.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onSwitchToUserView}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-orange-600/25 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <User className="w-4 h-4" />
              Customer Booking View
              <ArrowRight className="w-3.5 h-3.5 text-white/80" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Revenue */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">Gross Booked Revenue</span>
            <div className="p-2.5 bg-orange-50 text-orange-600 rounded-2xl">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 mt-2 block tracking-tight">₹{totalRevenue.toLocaleString('en-IN')}</span>
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl w-fit">
            <TrendingUp className="w-3 h-3" />
            <span>Total Fare Collection</span>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">Pending Requests</span>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-2xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-amber-600 mt-2 block tracking-tight">{pendingRidesCount}</span>
          <div className="mt-2.5">
            {pendingRidesCount > 0 ? (
              <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-xl inline-flex items-center gap-1 animate-pulse">
                ⚠️ Needs Driver Assignment
              </span>
            ) : (
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-xl inline-flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-600" /> All Dispatched
              </span>
            )}
          </div>
        </div>

        {/* Confirmed / Active Trips */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">Active / Confirmed Trips</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Car className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-emerald-600 mt-2 block tracking-tight">{activeRidesCount}</span>
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl w-fit">
            <span>● On Road & Scheduled</span>
          </div>
        </div>

        {/* Fleet Ready */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">Fleet Ready in Bihar</span>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
              <Fuel className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-blue-600 mt-2 block tracking-tight">
            {availableCarsCount} <span className="text-xs text-gray-400 font-medium">/ {vehicles.length} cars</span>
          </span>
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-xl w-fit">
            <span>{Math.round((availableCarsCount / (vehicles.length || 1)) * 100)}% Available for Duty</span>
          </div>
        </div>
      </div>

      {/* Sub-navigation Segmented Tab Bar */}
      <div className="bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap gap-1.5 mb-8 select-none">
        <button
          onClick={() => setActiveSubTab('bookings')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'bookings'
              ? 'bg-white text-orange-600 shadow-sm border border-orange-200/50'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <FileText className="w-4 h-4" /> Bookings & Dispatch ({bookings.length})
        </button>
        <button
          onClick={() => setActiveSubTab('fleet')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'fleet'
              ? 'bg-white text-orange-600 shadow-sm border border-orange-200/50'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Car className="w-4 h-4" /> Bihar Fleet Management ({vehicles.length})
        </button>
        <button
          onClick={() => setActiveSubTab('notifications')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'notifications'
              ? 'bg-white text-orange-600 shadow-sm border border-orange-200/50'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Bell className="w-4 h-4" /> Live Booking Alerts
          {unreadNotifsCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] bg-red-600 text-white rounded-full font-black animate-pulse">
              {unreadNotifsCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'analytics'
              ? 'bg-white text-orange-600 shadow-sm border border-orange-200/50'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Award className="w-4 h-4" /> District Analytics
        </button>
      </div>

      {/* SUBTAB 1: BOOKINGS & DISPATCH CONTROLS */}
      {activeSubTab === 'bookings' && (
        <div className="space-y-6">
          {/* Filter & Search Bar */}
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by passenger name, phone, or booking ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60">
              {[
                { id: 'All', label: 'All', count: bookings.length, highlight: false },
                { id: 'Pending', label: 'Pending', count: pendingCount, highlight: pendingCount > 0 },
                { id: 'Confirmed', label: 'Confirmed', count: confirmedCount, highlight: false },
                { id: 'Completed', label: 'Completed', count: completedCount, highlight: false },
                { id: 'Cancelled', label: 'Cancelled', count: cancelledCount, highlight: false },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setBookingFilter(opt.id as any)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                    bookingFilter === opt.id
                      ? 'bg-orange-600 text-white shadow-sm'
                      : opt.highlight
                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      : 'text-slate-600 hover:bg-white hover:text-orange-600'
                  }`}
                >
                  <span>{opt.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      bookingFilter === opt.id
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {opt.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Bookings Table */}
          <div className="overflow-x-auto bg-white border border-gray-100 rounded-3xl shadow-sm">
            <table className="min-w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50/80 border-b border-slate-100 uppercase text-[11px] font-black text-slate-500 tracking-wider">
                <tr>
                  <th className="p-4 pl-6">Passenger Details</th>
                  <th className="p-4">Trip Route & Date</th>
                  <th className="p-4">Assigned Driver & Car</th>
                  <th className="p-4">Price & Payment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-center">Dispatch Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-gray-400 font-medium">
                      <div className="max-w-xs mx-auto">
                        <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-slate-600 font-bold text-sm">No matching bookings found</p>
                        <p className="text-xs text-slate-400 mt-1">Try changing the filter or search term.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => {
                    const pickupName = DISTRICTS.find((d) => d.id === b.pickupDistrictId)?.name || b.pickupDistrictId;
                    const dropoffName =
                      b.bookingType === 'local'
                        ? `Local (${b.localDurationHours}h)`
                        : DISTRICTS.find((d) => d.id === b.dropoffDistrictId)?.name || b.dropoffDistrictId;
                    const vehicle = vehicles.find((v) => v.id === b.vehicleId);
                    const passengerInitial = b.userName.trim().charAt(0).toUpperCase() || 'P';

                    return (
                      <tr key={b.id} className="hover:bg-slate-50/60 transition group">
                        {/* Passenger */}
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-xs">
                              {passengerInitial}
                            </div>
                            <div>
                              <div className="font-extrabold text-slate-900 text-sm leading-tight">{b.userName}</div>
                              <a
                                href={`tel:${b.userPhone}`}
                                className="text-gray-500 hover:text-orange-600 font-medium text-xs mt-0.5 inline-block transition"
                              >
                                {b.userPhone}
                              </a>
                              <div className="text-[10px] text-gray-400 font-mono mt-0.5">#{b.id.slice(0, 8)}</div>
                            </div>
                          </div>
                        </td>

                        {/* Route & Schedule */}
                        <td className="p-4">
                          <div className="font-black text-slate-900 text-xs flex items-center gap-1.5 flex-wrap">
                            <span className="text-orange-600">{pickupName}</span>
                            <span className="text-gray-400">➔</span>
                            <span className="text-slate-800">{dropoffName}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium mt-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{b.pickupDateTime.replace('T', ' • ')}</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span className="text-[10px] bg-slate-100 font-bold px-2 py-0.5 rounded-md text-slate-600 uppercase border border-slate-200">
                              {b.bookingType} ({b.distanceKm} km)
                            </span>
                          </div>
                        </td>

                        {/* Driver & Car */}
                        <td className="p-4">
                          {b.driverName ? (
                            <div className="space-y-0.5">
                              <div className="font-extrabold text-slate-900 flex items-center gap-1.5 text-xs">
                                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{b.driverName}</span>
                              </div>
                              <div className="text-gray-500 font-mono text-[11px]">{b.driverPhone}</div>
                              <div className="flex items-center gap-1.5 pt-0.5">
                                <span className="text-[10px] bg-orange-50 border border-orange-200 text-orange-700 font-mono font-bold px-1.5 py-0.5 rounded">
                                  {b.vehicleNumber || 'BR-01-ASSIGNED'}
                                </span>
                                {b.otp && (
                                  <span className="text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono font-black px-1.5 py-0.5 rounded">
                                    OTP: {b.otp}
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div>
                              <button
                                onClick={() => setAssigningBooking(b)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 font-extrabold rounded-xl transition text-[11px] shadow-xs cursor-pointer active:scale-95"
                              >
                                <Plus className="w-3.5 h-3.5 text-orange-600" /> Assign Driver
                              </button>
                              <div className="text-[11px] text-gray-400 mt-1">
                                Req: {vehicle?.name || 'Selected Model'}
                              </div>
                            </div>
                          )}
                        </td>

                        {/* Price & Payment */}
                        <td className="p-4">
                          <div className="font-black text-slate-900 text-base leading-tight">
                            ₹{b.totalFare.toLocaleString('en-IN')}
                          </div>
                          <div className="mt-1">
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                              {b.paymentMethod || 'Cash to Driver'}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="p-4">
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full border font-extrabold inline-flex items-center gap-1.5 ${
                              b.status === 'Confirmed'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : b.status === 'Completed'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : b.status === 'Cancelled'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                b.status === 'Confirmed'
                                  ? 'bg-emerald-600'
                                  : b.status === 'Completed'
                                  ? 'bg-blue-600'
                                  : b.status === 'Cancelled'
                                  ? 'bg-rose-600'
                                  : 'bg-amber-600 animate-pulse'
                              }`}
                            />
                            {b.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-4 pr-6">
                          <div className="flex flex-wrap justify-center gap-1.5 items-center">
                            {b.status === 'Pending' && (
                              <button
                                onClick={() => setAssigningBooking(b)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer active:scale-95"
                                title="Assign Driver & Confirm"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Accept & Assign</span>
                              </button>
                            )}

                            {b.status === 'Confirmed' && (
                              <button
                                onClick={() => handleUpdateBookingStatus(b.id, 'Completed')}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer active:scale-95"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Complete</span>
                              </button>
                            )}

                            {(b.status === 'Pending' || b.status === 'Confirmed') && (
                              <button
                                onClick={() => handleUpdateBookingStatus(b.id, 'Cancelled')}
                                className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl border border-rose-200 transition cursor-pointer active:scale-95"
                              >
                                Cancel
                              </button>
                            )}

                            <button
                              onClick={() => onViewInvoice(b)}
                              className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition cursor-pointer"
                              title="Print Invoice / Receipt"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteBooking(b.id)}
                              className="p-2 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 text-slate-400 rounded-xl transition cursor-pointer"
                              title="Delete Permanently"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 2: FLEET INVENTORY MANAGEMENT */}
      {activeSubTab === 'fleet' && (
        <div className="space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div>
              <h3 className="text-xl font-black text-slate-900">Bihar Fleet Control & Inventory</h3>
              <p className="text-xs text-gray-500 mt-1">
                Add new vehicle models, update per-km pricing, modify seating capacity, or toggle car availability status.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingVehicleId(null);
                setVName('');
                setVTier('Economy');
                setVBase(300);
                setVPerKm(11);
                setVSeats(4);
                setVLuggage(2);
                setVAC(true);
                setVAuto(false);
                setVPlate('BR-01-XX-0000');
                setVFuel('CNG');
                setIsAddVehicleOpen(!isAddVehicleOpen);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-black text-xs rounded-2xl shadow-md shadow-orange-100 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> {isAddVehicleOpen && !editingVehicleId ? 'Close Form' : 'Register New Vehicle'}
            </button>
          </div>

          {/* Creation / Edit Form Slider */}
          {isAddVehicleOpen && (
            <form
              onSubmit={handleSaveVehicle}
              className="bg-white border-2 border-orange-200 p-6 rounded-3xl shadow-lg space-y-4 animate-in fade-in"
            >
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Car className="w-5 h-5 text-orange-600" />
                  {editingVehicleId ? 'Edit Vehicle Specifications' : 'Register Brand-New Vehicle in Bihar Fleet'}
                </h4>
                <button
                  type="button"
                  onClick={() => setIsAddVehicleOpen(false)}
                  className="text-xs text-gray-400 hover:text-gray-600 font-bold"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Vehicle Model & Make</label>
                  <input
                    type="text"
                    placeholder="e.g. Maruti Suzuki Ertiga"
                    value={vName}
                    onChange={(e) => setVName(e.target.value)}
                    className="w-full bg-gray-50 p-2.5 text-xs border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category / Tier</label>
                  <select
                    value={vTier}
                    onChange={(e) => setVTier(e.target.value as VehicleTier)}
                    className="w-full bg-gray-50 p-2.5 text-xs border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  >
                    <option value="Economy">Economy Hatchback</option>
                    <option value="Sedan">Sedan Comfort</option>
                    <option value="SUV">SUV/MUV (6-7 seats)</option>
                    <option value="Luxury">Luxury Premium Tier</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Registration Plate (Bihar RTO)</label>
                  <input
                    type="text"
                    placeholder="e.g. BR-01-PA-1234"
                    value={vPlate}
                    onChange={(e) => setVPlate(e.target.value.toUpperCase())}
                    className="w-full bg-gray-50 p-2.5 text-xs border border-gray-200 rounded-xl font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Base Fare (₹)</label>
                  <input
                    type="number"
                    value={vBase}
                    onChange={(e) => setVBase(Number(e.target.value))}
                    className="w-full bg-gray-50 p-2.5 text-xs border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Per Km Rate (₹)</label>
                  <input
                    type="number"
                    value={vPerKm}
                    onChange={(e) => setVPerKm(Number(e.target.value))}
                    className="w-full bg-gray-50 p-2.5 text-xs border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Seating Capacity</label>
                  <input
                    type="number"
                    value={vSeats}
                    onChange={(e) => setVSeats(Number(e.target.value))}
                    className="w-full bg-gray-50 p-2.5 text-xs border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Luggage Bags</label>
                  <input
                    type="number"
                    value={vLuggage}
                    onChange={(e) => setVLuggage(Number(e.target.value))}
                    className="w-full bg-gray-50 p-2.5 text-xs border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Fuel Type</label>
                  <select
                    value={vFuel}
                    onChange={(e) => setVFuel(e.target.value as 'CNG' | 'Diesel' | 'Petrol' | 'Electric')}
                    className="w-full bg-gray-50 p-2.5 text-xs border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                  >
                    <option value="CNG">CNG Green</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={vImage}
                  onChange={(e) => setVImage(e.target.value)}
                  className="w-full bg-gray-50 p-2.5 text-xs border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={vAC}
                    onChange={(e) => setVAC(e.target.checked)}
                    className="w-4 h-4 text-orange-600 rounded border-gray-300"
                  />
                  <span className="text-xs font-extrabold text-slate-700">Air Conditioned Cabin</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={vAuto}
                    onChange={(e) => setVAuto(e.target.checked)}
                    className="w-4 h-4 text-orange-600 rounded border-gray-300"
                  />
                  <span className="text-xs font-extrabold text-slate-700">Automatic Transmission</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddVehicleOpen(false)}
                  className="px-4 py-2.5 border border-gray-200 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-black text-xs rounded-xl shadow transition"
                >
                  {editingVehicleId ? 'Save Changes' : 'Complete Registration'}
                </button>
              </div>
            </form>
          )}

          {/* Vehicles Fleet Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="h-44 w-full bg-gray-50 overflow-hidden relative">
                    <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="text-[11px] bg-black/70 backdrop-blur-md text-white px-2.5 py-0.5 font-bold rounded-lg uppercase">
                        {v.tier}
                      </span>
                      <span className="text-[11px] bg-orange-600/90 text-white px-2 py-0.5 font-bold rounded-lg font-mono">
                        {v.fuelType || 'CNG'}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span
                        className={`text-[11px] px-2.5 py-1 rounded-full font-black select-none shadow-sm ${
                          v.available
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                        }`}
                      >
                        {v.available ? '● Available' : '● Booked / Busy'}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-base font-black text-slate-900 leading-tight">
                        {v.name}
                      </h4>
                      <span className="text-xs font-black text-orange-600">₹{v.perKmRate}/km</span>
                    </div>

                    <div className="text-[11px] font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded-lg inline-block border border-gray-100">
                      RTO: {v.registrationNumber || 'BR-01-REGISTERED'}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-medium text-gray-500 border-t border-gray-50 pt-2.5">
                      <span className="flex items-center gap-1.5">
                        <Settings className="w-3.5 h-3.5 text-orange-500" /> {v.transmission}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Luggage className="w-3.5 h-3.5 text-orange-500" /> {v.luggage} bags
                      </span>
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-orange-500" /> {v.seats} Seats
                      </span>
                      <span className="flex items-center gap-1.5">
                        <IndianRupee className="w-3.5 h-3.5 text-orange-500" /> Base ₹{v.baseFare}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Fleet action buttons */}
                <div className="p-4 pt-0 border-t border-gray-50 bg-gray-50/30 flex gap-2 items-center">
                  <button
                    onClick={() => handleToggleVehicleAvailability(v.id)}
                    className={`flex-1 py-2 text-xs font-black rounded-xl border text-center transition cursor-pointer ${
                      v.available
                        ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                        : 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                    }`}
                  >
                    {v.available ? 'Set Unavailable' : 'Mark Available'}
                  </button>

                  <button
                    onClick={() => handleStartEditVehicle(v)}
                    className="p-2 border border-gray-200 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition"
                    title="Edit vehicle details"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteVehicle(v.id)}
                    className="p-2 border border-red-100 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                    title="Remove from fleet"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: LIVE NOTIFICATIONS LOG */}
      {activeSubTab === 'notifications' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-600" /> Live Admin Booking Alerts & Events
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Real-time log of customer reservations, driver assignments, and fleet availability status changes.
              </p>
            </div>
            {notifications.length > 0 && (
              <button
                onClick={handleMarkAllNotifsRead}
                className="px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" /> Mark All as Read
              </button>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
            {notifications.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <Bell className="w-10 h-10 mx-auto mb-2 opacity-30 text-orange-500" />
                <h4 className="text-base font-bold text-slate-800">No alerts yet</h4>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  When a user books a ride on Bihar Cabs, an instant notification with sound and details will show up right here!
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-5 flex items-start gap-4 transition ${
                    notif.read ? 'bg-white' : 'bg-orange-50/40 border-l-4 border-l-orange-600'
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-2xl flex-shrink-0 ${
                      notif.type === 'booking_new'
                        ? 'bg-orange-100 text-orange-600'
                        : notif.type === 'driver_assigned'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-blue-100 text-blue-600'
                    }`}
                  >
                    {notif.type === 'booking_new' ? (
                      <Car className="w-5 h-5" />
                    ) : notif.type === 'driver_assigned' ? (
                      <UserCheck className="w-5 h-5" />
                    ) : (
                      <Bell className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline gap-2">
                      <h4 className="text-sm font-black text-slate-900">{notif.title}</h4>
                      <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap">
                        {new Date(notif.createdAt).toLocaleTimeString()} • {new Date(notif.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{notif.message}</p>
                    {notif.bookingId && (
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => {
                            setActiveSubTab('bookings');
                            setSearchQuery(notif.bookingId || '');
                          }}
                          className="text-[11px] font-bold text-orange-600 bg-orange-100/70 hover:bg-orange-200/70 px-2.5 py-1 rounded-lg transition inline-flex items-center gap-1"
                        >
                          View Booking #{notif.bookingId.slice(0, 8)} ➔
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 4: DISTRICT ANALYTICS */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-black text-slate-900">Bihar District Travel Trends & Origin Hubs</h3>
            <p className="text-xs text-gray-500 mt-1">Live booking distribution across districts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 border border-gray-100 rounded-3xl shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-orange-600" /> Origin Districts (Pickups)
              </h4>
              <div className="space-y-3">
                {DISTRICTS.map((d) => {
                  const count = bookings.filter((b) => b.pickupDistrictId === d.id).length;
                  const pct = bookings.length > 0 ? (count / bookings.length) * 100 : 0;
                  return (
                    <div key={d.id}>
                      <div className="flex justify-between items-baseline text-xs mb-1">
                        <span className="font-extrabold text-slate-700">{d.name} ({d.region} Bihar)</span>
                        <span className="font-bold text-slate-400">
                          {count} bookings ({pct.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-orange-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white p-6 border border-gray-100 rounded-3xl shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Car className="w-4 h-4 text-orange-600" /> Segment Level Demand Breakdown
              </h4>
              <div className="space-y-4">
                {(['Economy', 'Sedan', 'SUV', 'Luxury'] as const).map((tier) => {
                  const matchingFleet = vehicles.filter((v) => v.tier === tier).map((v) => v.id);
                  const count = bookings.filter((b) => matchingFleet.includes(b.vehicleId)).length;
                  const pct = bookings.length > 0 ? (count / bookings.length) * 100 : 0;
                  return (
                    <div key={tier}>
                      <div className="flex justify-between items-baseline text-xs mb-1">
                        <span className="font-extrabold text-slate-800">{tier} Category</span>
                        <span className="font-bold text-slate-500">
                          {count} trips ({pct.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Driver Assignment Modal */}
      {assigningBooking && (
        <DriverAssignmentModal
          booking={assigningBooking}
          onAssign={handleAssignDriver}
          onClose={() => setAssigningBooking(null)}
        />
      )}
    </div>
  );
};
