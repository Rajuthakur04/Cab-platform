import React from 'react';
import { Booking, Vehicle } from '../types';
import { DISTRICTS } from '../data/mockData';
import { X, Printer, Car, CheckCircle, ShieldCheck, MapPin } from 'lucide-react';

interface InvoiceModalProps {
  booking: Booking;
  vehicle?: Vehicle;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ booking, vehicle, onClose }) => {
  const pickupName = DISTRICTS.find((d) => d.id === booking.pickupDistrictId)?.name || booking.pickupDistrictId;
  const dropoffName =
    booking.bookingType === 'local'
      ? `Local Rental (${booking.localDurationHours || 4} Hours)`
      : DISTRICTS.find((d) => d.id === booking.dropoffDistrictId)?.name || booking.dropoffDistrictId;

  const baseFare = vehicle?.baseFare || 350;
  const kmFare = booking.totalFare - baseFare > 0 ? booking.totalFare - baseFare : 0;
  const gstAmount = Math.round(booking.totalFare * 0.05);
  const grandTotal = booking.totalFare + gstAmount;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50 p-4 print:p-0 print:bg-white">
      <div className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 print:shadow-none print:border-none print:max-h-full">
        {/* Modal Top Bar (hidden on print) */}
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-100 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider bg-orange-100/70 px-2.5 py-1 rounded-full">
              Trip Receipt & Invoice
            </span>
            <span className="text-xs text-gray-400 font-mono">#{booking.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-orange-300 text-xs font-bold text-gray-700 hover:text-orange-600 rounded-xl transition shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" /> Print / PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Body */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-800">
          {/* Brand Header */}
          <div className="flex justify-between items-start border-b border-gray-100 pb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-orange-600 to-amber-500 p-2.5 rounded-2xl text-white shadow-md shadow-orange-200">
                <Car className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  Bihar Cabs <span className="text-orange-600 text-xs font-bold">Official Invoice</span>
                </h2>
                <p className="text-xs text-gray-500">Government Registered Inter-District Mobility Portal</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Station Road, Patna / Teghra, Bihar - 800001</p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-xs font-extrabold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                <CheckCircle className="w-3.5 h-3.5" /> {booking.status.toUpperCase()}
              </span>
              <p className="text-xs text-gray-400 mt-1 font-mono">Invoice Date: {new Date(booking.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Passenger & Trip Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50/70 p-4 rounded-2xl border border-slate-100 text-xs">
            <div>
              <span className="text-gray-400 font-semibold block uppercase text-[10px]">Passenger</span>
              <span className="font-extrabold text-slate-900 text-sm">{booking.userName}</span>
              <span className="block text-gray-500">{booking.userPhone}</span>
            </div>
            <div>
              <span className="text-gray-400 font-semibold block uppercase text-[10px]">Pickup Date & Time</span>
              <span className="font-extrabold text-slate-900 text-sm">{booking.pickupDateTime.replace('T', ' ')}</span>
              <span className="block text-gray-500">Booking Type: {booking.bookingType}</span>
            </div>
            <div>
              <span className="text-gray-400 font-semibold block uppercase text-[10px]">Assigned Driver</span>
              <span className="font-extrabold text-slate-900 text-sm">
                {booking.driverName || 'Bihar Cabs Fleet Driver'}
              </span>
              <span className="block text-gray-500 font-mono">
                {booking.vehicleNumber || vehicle?.registrationNumber || 'BR-01-CABS'}
              </span>
            </div>
          </div>

          {/* Route Section */}
          <div className="border border-orange-100 bg-orange-50/30 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-orange-600 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold">Route Traveled</span>
                <p className="font-black text-slate-900 text-sm">
                  {pickupName} <span className="text-orange-600 mx-1.5">➔</span> {dropoffName}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-gray-400 uppercase font-bold">Distance</span>
              <p className="font-bold text-slate-800 text-sm">{booking.distanceKm} Kilometers</p>
            </div>
          </div>

          {/* Fare Breakdown Table */}
          <div className="border border-gray-100 rounded-2xl overflow-hidden">
            <table className="min-w-full text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold border-b border-gray-100">
                <tr>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-center">Unit/Km</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <tr>
                  <td className="p-3">
                    <span className="font-bold text-slate-800">{vehicle?.name || 'Selected Vehicle'}</span>
                    <span className="text-gray-400 block text-[11px]">Base reservation allowance</span>
                  </td>
                  <td className="p-3 text-center text-gray-500">Flat</td>
                  <td className="p-3 text-right font-bold text-slate-800">₹{baseFare}</td>
                </tr>
                <tr>
                  <td className="p-3">
                    <span className="font-bold text-slate-800">Distance Travel Charge</span>
                    <span className="text-gray-400 block text-[11px]">{booking.distanceKm} km @ ₹{vehicle?.perKmRate || 14}/km</span>
                  </td>
                  <td className="p-3 text-center text-gray-500">{booking.distanceKm} km</td>
                  <td className="p-3 text-right font-bold text-slate-800">₹{kmFare}</td>
                </tr>
                <tr>
                  <td className="p-3 text-gray-600">State Road & Mobility GST (5%)</td>
                  <td className="p-3 text-center text-gray-400">Govt. Tax</td>
                  <td className="p-3 text-right text-gray-600 font-semibold">₹{gstAmount}</td>
                </tr>
                <tr className="bg-orange-50/50 font-black text-sm">
                  <td className="p-3 text-orange-900">Total Net Fare</td>
                  <td className="p-3 text-center text-orange-700">INR</td>
                  <td className="p-3 text-right text-orange-600 text-base">₹{grandTotal}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payment & Security Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2 text-xs text-gray-500">
            <div>
              <span className="font-bold text-slate-700">Payment Mode: </span>
              <span className="bg-gray-100 px-2 py-0.5 rounded font-mono font-bold text-slate-800">
                {booking.paymentMethod || 'Cash to Driver'}
              </span>
              {booking.otp && (
                <span className="ml-3 font-bold text-slate-700">
                  Ride Security OTP: <span className="text-orange-600 font-mono font-black">{booking.otp}</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-green-700 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Bihar Cabs Verified Trip Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
