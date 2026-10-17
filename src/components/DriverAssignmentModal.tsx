import React, { useState } from 'react';
import { Booking } from '../types';
import { BIHAR_DRIVERS, DISTRICTS } from '../data/mockData';
import { X, UserCheck, KeyRound, Check } from 'lucide-react';

interface DriverAssignmentModalProps {
  booking: Booking;
  onAssign: (bookingId: string, driverInfo: { driverName: string; driverPhone: string; vehicleNumber: string; otp: string }) => void;
  onClose: () => void;
}

export const DriverAssignmentModal: React.FC<DriverAssignmentModalProps> = ({
  booking,
  onAssign,
  onClose,
}) => {
  const [selectedDriverId, setSelectedDriverId] = useState<string>(BIHAR_DRIVERS[0]?.id || '');
  const [customName, setCustomName] = useState('');
  const [customPhone, setCustomPhone] = useState('');
  const [customPlate, setCustomPlate] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [otp] = useState(() => Math.floor(1000 + Math.random() * 9000).toString());

  const pickupName = DISTRICTS.find((d) => d.id === booking.pickupDistrictId)?.name;
  const dropoffName =
    booking.bookingType === 'local'
      ? `Local (${booking.localDurationHours}h)`
      : DISTRICTS.find((d) => d.id === booking.dropoffDistrictId)?.name;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (useCustom) {
      if (!customName || !customPhone || !customPlate) {
        alert('Please fill out all custom driver details.');
        return;
      }
      onAssign(booking.id, {
        driverName: customName,
        driverPhone: customPhone,
        vehicleNumber: customPlate,
        otp,
      });
    } else {
      const selected = BIHAR_DRIVERS.find((d) => d.id === selectedDriverId) || BIHAR_DRIVERS[0];
      onAssign(booking.id, {
        driverName: selected.name,
        driverPhone: selected.phone,
        vehicleNumber: selected.vehicleNumber,
        otp,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 p-4">
      <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-600 text-white rounded-xl shadow-sm">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Assign Bihar Fleet Driver</h3>
              <p className="text-xs text-gray-500">Booking #{booking.id.slice(0, 10)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Trip summary badge */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex justify-between items-center text-xs">
            <div>
              <span className="text-gray-400 font-bold block">ROUTE & PASSENGER</span>
              <span className="font-extrabold text-slate-800">
                {pickupName} ➔ {dropoffName}
              </span>
              <span className="block text-gray-500">
                {booking.userName} ({booking.userPhone})
              </span>
            </div>
            <div className="text-right">
              <span className="text-gray-400 font-bold block">FARE</span>
              <span className="text-sm font-black text-orange-600">₹{booking.totalFare}</span>
            </div>
          </div>

          {/* Toggle between registered Bihar drivers vs custom */}
          <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setUseCustom(false)}
              className={`flex-1 py-2 rounded-lg transition ${
                !useCustom ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-slate-800'
              }`}
            >
              Registered Bihar Drivers ({BIHAR_DRIVERS.length})
            </button>
            <button
              type="button"
              onClick={() => setUseCustom(true)}
              className={`flex-1 py-2 rounded-lg transition ${
                useCustom ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-slate-800'
              }`}
            >
              + Enter Custom Driver
            </button>
          </div>

          {!useCustom ? (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">Select Available Driver:</label>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {BIHAR_DRIVERS.map((d) => (
                  <label
                    key={d.id}
                    onClick={() => setSelectedDriverId(d.id)}
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition select-none ${
                      selectedDriverId === d.id
                        ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-200'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full border flex items-center justify-center border-orange-500">
                        {selectedDriverId === d.id && <div className="w-2 h-2 rounded-full bg-orange-600" />}
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                          {d.name}
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                            ★ {d.rating}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-500">
                          {d.district} Hub • {d.vehicleNumber}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-gray-600 font-mono font-medium">{d.phone}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Driver Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rajeshwar Prasad"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98350 00000"
                    value={customPhone}
                    onChange={(e) => setCustomPhone(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Vehicle Plate No.</label>
                  <input
                    type="text"
                    placeholder="BR-01-EA-1234"
                    value={customPlate}
                    onChange={(e) => setCustomPlate(e.target.value.toUpperCase())}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Generated Ride Security OTP */}
          <div className="bg-amber-50/70 border border-amber-200 p-3.5 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-600" />
              <div>
                <span className="font-extrabold text-amber-900 block">Ride Security OTP</span>
                <span className="text-[11px] text-amber-700">Passenger provides this before trip starts</span>
              </div>
            </div>
            <span className="text-base font-black font-mono tracking-widest text-orange-600 bg-white px-3 py-1 rounded-xl border border-amber-200 shadow-sm">
              {otp}
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-gray-200 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white text-xs font-black rounded-xl transition shadow-md shadow-orange-100 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Confirm & Dispatch Driver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
