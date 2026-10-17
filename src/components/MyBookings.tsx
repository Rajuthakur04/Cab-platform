import React from 'react';
import { Booking, BookingStatus, Vehicle } from '../types';
import { DISTRICTS } from '../data/mockData';
import {
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Car,
  UserCheck,
  Phone,
  Printer
} from 'lucide-react';

interface MyBookingsProps {
  userId: string;
  bookings: Booking[];
  vehicles: Vehicle[];
  onCancelBooking: (id: string) => void;
  onViewInvoice: (booking: Booking) => void;
  onBookRideClick: () => void;
}

export const MyBookings: React.FC<MyBookingsProps> = ({
  userId,
  bookings,
  vehicles,
  onCancelBooking,
  onViewInvoice,
  onBookRideClick,
}) => {
  const userBookings = bookings.filter((b) => b.userId === userId);

  const getStatusStyle = (status: BookingStatus) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-700 border border-green-200 font-bold';
      case 'Completed':
        return 'bg-blue-100 text-blue-700 border border-blue-200 font-bold';
      case 'Cancelled':
        return 'bg-red-100 text-red-700 border border-red-200 font-bold';
      default:
        return 'bg-yellow-100 text-yellow-700 border border-yellow-200 font-bold';
    }
  };

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case 'Confirmed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Completed':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'Cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight font-display">Your Direct Bookings</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Track your active rides, driver details, OTP verification codes, and official receipts.
          </p>
        </div>

        <button
          onClick={onBookRideClick}
          className="px-4 py-2.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-orange-100 transition"
        >
          + Book Another Ride
        </button>
      </div>

      {userBookings.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-100 rounded-3xl shadow-sm p-8">
          <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Car className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-slate-900 mb-2">No Active Bookings Yet</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
            You haven't reserved any rides yet. Book an inter-district ride or hourly rental cab across Bihar now!
          </p>
          <button
            onClick={onBookRideClick}
            className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-orange-100 transition"
          >
            Explore & Book a Ride Now
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {userBookings.map((b) => {
            const vehicle = vehicles.find((v) => v.id === b.vehicleId);
            const pickupDistrict = DISTRICTS.find((d) => d.id === b.pickupDistrictId)?.name || b.pickupDistrictId;
            const dropoffDistrict =
              b.bookingType === 'local'
                ? `Local hourly (${b.localDurationHours}h)`
                : DISTRICTS.find((d) => d.id === b.dropoffDistrictId)?.name || b.dropoffDistrictId;

            return (
              <div
                key={b.id}
                className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col gap-5 hover:shadow-md transition"
              >
                {/* Trip Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-50 pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] bg-slate-100 font-black px-2.5 py-1 text-slate-700 border border-slate-200 rounded-full uppercase">
                      {b.bookingType}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 ${getStatusStyle(
                        b.status
                      )}`}
                    >
                      {getStatusIcon(b.status)}
                      {b.status}
                    </span>
                    <span className="text-xs text-gray-400 font-mono font-medium">
                      Ref: #{b.id}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-gray-400 block font-bold">Fare</span>
                    <span className="text-xl font-black text-orange-600">₹{b.totalFare}</span>
                  </div>
                </div>

                {/* Route & Timing Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">Route</span>
                      <span className="font-extrabold text-slate-900 text-sm">
                        {pickupDistrict} ➔ {dropoffDistrict}
                      </span>
                      <span className="block text-gray-500 mt-0.5">Distance: {b.distanceKm} km</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Calendar className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">Schedule</span>
                      <span className="font-extrabold text-slate-900 text-sm">
                        {b.pickupDateTime.replace('T', ' ')}
                      </span>
                      <span className="block text-gray-500 mt-0.5">
                        Vehicle: {vehicle ? vehicle.name : 'Standard Bihar Cab'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Driver Details Card (If assigned by Admin) */}
                {b.driverName && (
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-2xl border border-orange-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-white text-orange-600 rounded-xl shadow-sm border border-orange-100">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-orange-700 uppercase tracking-wider block">
                          Assigned Bihar Driver
                        </span>
                        <span className="text-sm font-black text-slate-900 block">{b.driverName}</span>
                        <span className="text-gray-500 font-mono text-[11px]">Plate: {b.vehicleNumber || 'Bihar Cab'}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      {b.otp && (
                        <div className="bg-white px-3 py-1.5 rounded-xl border border-orange-200 text-center">
                          <span className="text-[9px] text-gray-400 uppercase font-bold block">Security OTP</span>
                          <span className="text-base font-black font-mono text-orange-600 tracking-widest">{b.otp}</span>
                        </div>
                      )}

                      {b.driverPhone && (
                        <a
                          href={`tel:${b.driverPhone}`}
                          className="inline-flex items-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition text-xs shadow-sm"
                        >
                          <Phone className="w-3.5 h-3.5" /> Call Driver
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Footer Controls: Invoice & Cancel */}
                <div className="flex flex-wrap justify-between items-center gap-2 pt-2 border-t border-gray-50">
                  <button
                    onClick={() => onViewInvoice(b)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-200 text-gray-700 hover:text-orange-600 text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-orange-600" /> View / Print Trip Invoice
                  </button>

                  {b.status === 'Pending' && (
                    <button
                      onClick={() => onCancelBooking(b.id)}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition border border-red-200/60 cursor-pointer"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
