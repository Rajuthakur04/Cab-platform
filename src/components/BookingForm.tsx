import React, { useState } from 'react';
import { DISTRICTS, getDistance } from '../data/mockData';
import { Vehicle, Booking, User, DistrictId } from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  Navigation,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Banknote,
  FileText
} from 'lucide-react';
import { playNotificationSound } from '../utils/sound';

interface BookingFormProps {
  currentUser: User | null;
  onOpenAuth: () => void;
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  vehicles: Vehicle[];
  onBookingCreated?: (newBooking: Booking) => void;
  setCurrentTab: (tab: string) => void;
  onViewInvoice: (booking: Booking) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  currentUser,
  onOpenAuth,
  setBookings,
  vehicles,
  onBookingCreated,
  setCurrentTab,
  onViewInvoice,
}) => {
  const [bookingType, setBookingType] = useState<'inter-district' | 'local'>('inter-district');
  const [pickupDistrict, setPickupDistrict] = useState<DistrictId>('patna');
  const [dropoffDistrict, setDropoffDistrict] = useState<DistrictId | 'local'>('muzaffarpur');
  const [localHours, setLocalHours] = useState<number>(4);

  // Default to today + 2 hours
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState<string>(today);
  const [time, setTime] = useState<string>('10:00');

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[0]?.id || '');
  const [passengerName, setPassengerName] = useState<string>(currentUser?.name || '');
  const [passengerPhone, setPassengerPhone] = useState<string>(currentUser?.phone || '');
  const [pickupAddress, setPickupAddress] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'UPI'>('Cash');

  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  const availableVehicles = vehicles.filter((v) => v.available);

  const distance = getDistance(
    pickupDistrict,
    bookingType === 'local' ? 'local' : (dropoffDistrict as DistrictId),
    localHours
  );

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || availableVehicles[0];

  const totalFare = selectedVehicle
    ? Math.round(selectedVehicle.baseFare + distance * selectedVehicle.perKmRate)
    : 0;

  const handleBookingTypeChange = (type: 'inter-district' | 'local') => {
    setBookingType(type);
    if (type === 'local') {
      setDropoffDistrict('local');
    } else {
      setDropoffDistrict(pickupDistrict === 'patna' ? 'muzaffarpur' : 'patna');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      alert('Please Sign In first to reserve your ride.');
      onOpenAuth();
      return;
    }

    if (!selectedVehicle) {
      alert('Please select an available vehicle.');
      return;
    }

    if (!date || !time) {
      alert('Please select a pickup date and time.');
      return;
    }

    if (!passengerName || !passengerPhone) {
      alert('Please enter complete contact details.');
      return;
    }

    const bookingId = 'bk_' + Math.random().toString(36).substr(2, 8);
    const newBooking: Booking = {
      id: bookingId,
      userId: currentUser.id,
      userName: passengerName,
      userPhone: passengerPhone,
      pickupDistrictId: pickupDistrict,
      dropoffDistrictId: bookingType === 'local' ? 'local' : (dropoffDistrict as DistrictId),
      localDurationHours: bookingType === 'local' ? localHours : undefined,
      bookingType,
      vehicleId: selectedVehicle.id,
      pickupDateTime: `${date}T${time}`,
      distanceKm: distance,
      totalFare,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      paymentMethod,
      paymentStatus: 'Pending',
      notes: pickupAddress ? `Pickup Landmark: ${pickupAddress}` : undefined,
    };

    setBookings((prev) => [newBooking, ...prev]);
    setCreatedBooking(newBooking);
    setIsSuccess(true);

    // Play pleasant chime
    playNotificationSound();

    if (onBookingCreated) {
      onBookingCreated(newBooking);
    }
  };

  if (isSuccess && createdBooking) {
    const pickupDistrictName = DISTRICTS.find((d) => d.id === pickupDistrict)?.name;
    const dropoffDistrictName =
      bookingType === 'local'
        ? `Local (${localHours} Hours)`
        : DISTRICTS.find((d) => d.id === dropoffDistrict)?.name;

    return (
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
        <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-2xl text-center select-none animate-in fade-in zoom-in-95 flex flex-col items-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-4 ring-8 ring-green-50/60">
            <CheckCircle className="w-12 h-12" />
          </div>
          <span className="text-xs font-bold text-green-700 bg-green-100/70 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            Reservation Received
          </span>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Ride Successfully Booked!</h2>
          <p className="text-sm text-gray-600 mb-6 max-w-md">
            Your booking request has been sent to Bihar Cabs dispatch. Our admin team has received an instant notification and will assign a verified driver shortly.
          </p>

          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-3xl p-6 mb-6 w-full text-left space-y-3 shadow-sm">
            <div className="flex justify-between items-center text-xs border-b border-orange-100 pb-2">
              <span className="text-gray-500 font-semibold">Booking ID</span>
              <span className="font-mono font-bold text-slate-800">#{createdBooking.id}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 font-semibold">Route</span>
              <span className="font-extrabold text-slate-900">
                {pickupDistrictName} ➔ {dropoffDistrictName}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 font-semibold">Scheduled Date & Time</span>
              <span className="font-bold text-slate-800">
                {date} at {time}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 font-semibold">Vehicle Reserved</span>
              <span className="font-bold text-slate-800">{selectedVehicle?.name}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 font-semibold">Payment Mode</span>
              <span className="font-bold text-slate-800">{paymentMethod === 'Cash' ? 'Cash on Pickup' : 'UPI / Online'}</span>
            </div>

            <div className="flex justify-between items-center text-xs border-t border-orange-200/60 pt-3">
              <span className="text-gray-600 font-bold">Estimated Total Fare</span>
              <span className="text-2xl font-black text-orange-600">₹{totalFare}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <button
              onClick={() => onViewInvoice(createdBooking)}
              className="w-full py-3 bg-white border border-gray-200 hover:border-orange-300 text-slate-800 hover:text-orange-600 font-bold text-xs rounded-2xl transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-orange-600" />
              View Trip Receipt / Invoice
            </button>

            <button
              onClick={() => setCurrentTab('my-bookings')}
              className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-extrabold text-xs rounded-2xl transition shadow-md shadow-orange-100 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Track in My Bookings ➔
            </button>
          </div>

          <button
            onClick={() => {
              setIsSuccess(false);
              setCreatedBooking(null);
            }}
            className="mt-4 text-xs text-gray-500 hover:text-orange-600 font-bold underline"
          >
            + Book Another Ride
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-orange-50 border border-orange-200/70 rounded-full text-xs font-bold text-orange-700 mb-2.5">
          <Navigation className="w-3.5 h-3.5 text-orange-600" /> All 18 Bihar Districts Live Dispatch
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-display">
          Reserve Your Bihar Cab
        </h2>
        <p className="text-sm text-slate-500 max-w-xl mx-auto mt-1 font-medium">
          Doorstep pickup across Bihar, verified local drivers, and transparent pricing with no hidden charges.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Inputs Left (2 Cols) */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
            {/* Travel Type Selector */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                1. Select Travel Category
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleBookingTypeChange('inter-district')}
                  className={`p-4 rounded-2xl border text-left transition ${
                    bookingType === 'inter-district'
                      ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-200'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-sm font-black text-slate-900 block">Inter-District Ride</span>
                  <span className="text-xs text-gray-500 mt-0.5 block">Travel between different Bihar districts</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleBookingTypeChange('local')}
                  className={`p-4 rounded-2xl border text-left transition ${
                    bookingType === 'local'
                      ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-200'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-sm font-black text-slate-900 block">Hourly Local Cab</span>
                  <span className="text-xs text-gray-500 mt-0.5 block">Rent within city for 4h, 8h, or 12h</span>
                </button>
              </div>
            </div>

            {/* Origin & Destination Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-orange-600" /> Pickup District (Origin)
                </label>
                <select
                  value={pickupDistrict}
                  onChange={(e) => setPickupDistrict(e.target.value as DistrictId)}
                  className="w-full bg-gray-50 p-3 text-xs font-bold text-slate-800 border border-gray-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                >
                  {DISTRICTS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.region} Bihar)
                    </option>
                  ))}
                </select>
              </div>

              {bookingType === 'inter-district' ? (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" /> Destination District
                  </label>
                  <select
                    value={dropoffDistrict}
                    onChange={(e) => setDropoffDistrict(e.target.value as DistrictId)}
                    className="w-full bg-gray-50 p-3 text-xs font-bold text-slate-800 border border-gray-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  >
                    {DISTRICTS.filter((d) => d.id !== pickupDistrict).map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.region} Bihar)
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600" /> Package Duration
                  </label>
                  <select
                    value={localHours}
                    onChange={(e) => setLocalHours(Number(e.target.value))}
                    className="w-full bg-gray-50 p-3 text-xs font-bold text-slate-800 border border-gray-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  >
                    <option value={4}>4 Hours (48 km included)</option>
                    <option value={8}>8 Hours (96 km included - Full Day)</option>
                    <option value={12}>12 Hours (144 km included - Extended)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Schedule Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-orange-600" /> Pickup Date
                </label>
                <input
                  type="date"
                  min={today}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-gray-50 p-3 text-xs font-bold text-slate-800 border border-gray-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-orange-600" /> Pickup Time
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-gray-50 p-3 text-xs font-bold text-slate-800 border border-gray-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  required
                />
              </div>
            </div>

            {/* Vehicle Selection Grid */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                2. Select Vehicle from Bihar Fleet
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                {vehicles.map((v) => {
                  const isSelected = selectedVehicle?.id === v.id;
                  const isAvail = v.available;

                  return (
                    <div
                      key={v.id}
                      onClick={() => isAvail && setSelectedVehicleId(v.id)}
                      className={`p-3 rounded-2xl border transition flex gap-3 items-center select-none ${
                        !isAvail
                          ? 'opacity-50 bg-gray-100 border-gray-200 cursor-not-allowed'
                          : isSelected
                          ? 'border-orange-500 bg-orange-50/40 ring-2 ring-orange-200 cursor-pointer'
                          : 'border-gray-200 hover:bg-gray-50 cursor-pointer'
                      }`}
                    >
                      <div className="w-16 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
                        <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h4 className="text-xs font-black text-slate-900 truncate">{v.name}</h4>
                          <span className="text-[11px] font-black text-orange-600">₹{v.perKmRate}/km</span>
                        </div>
                        <div className="text-[10px] text-gray-500 mt-0.5">
                          {v.tier} • {v.seats} Seats • {v.ac ? 'AC' : 'Non-AC'}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                          Base: ₹{v.baseFare} {v.fuelType && `• ${v.fuelType}`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Passenger Information */}
            <div className="border-t border-gray-100 pt-5 space-y-4">
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                3. Passenger & Pickup Landmark
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Kumar"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    className="w-full bg-gray-50 p-3 text-xs border border-gray-200 rounded-2xl focus:bg-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    placeholder="e.g. 98350 12345"
                    value={passengerPhone}
                    onChange={(e) => setPassengerPhone(e.target.value)}
                    className="w-full bg-gray-50 p-3 text-xs border border-gray-200 rounded-2xl focus:bg-white focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Specific Pickup Address / Landmark in {DISTRICTS.find((d) => d.id === pickupDistrict)?.name}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near Patna Junction Platform 1 / Gandhi Maidan Gate 4"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  className="w-full bg-gray-50 p-3 text-xs border border-gray-200 rounded-2xl focus:bg-white focus:outline-none"
                />
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Payment Option</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Cash')}
                    className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                      paymentMethod === 'Cash'
                        ? 'border-orange-500 bg-orange-50/70 text-orange-700 ring-2 ring-orange-200'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-orange-600" />
                    Cash to Driver on Pickup
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                      paymentMethod === 'UPI'
                        ? 'border-orange-500 bg-orange-50/70 text-orange-700 ring-2 ring-orange-200'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-orange-600" />
                    Online / UPI Scan & Pay
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-black text-sm rounded-2xl shadow-xl shadow-orange-100 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
            >
              Confirm & Book Ride Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Fare Summary & Bihar Trust Card Right (1 Col) */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl space-y-4">
            <h3 className="text-base font-black text-slate-900 border-b border-gray-100 pb-3">
              Fare Calculation Breakdown
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center text-gray-600">
                <span>Estimated Distance</span>
                <span className="font-bold text-slate-800">{distance} km</span>
              </div>

              <div className="flex justify-between items-center text-gray-600">
                <span>Selected Vehicle</span>
                <span className="font-bold text-slate-800">{selectedVehicle?.name}</span>
              </div>

              <div className="flex justify-between items-center text-gray-600">
                <span>Base Departure Allowance</span>
                <span className="font-bold text-slate-800">₹{selectedVehicle?.baseFare || 300}</span>
              </div>

              <div className="flex justify-between items-center text-gray-600">
                <span>Distance Rate ({distance} km @ ₹{selectedVehicle?.perKmRate || 11}/km)</span>
                <span className="font-bold text-slate-800">
                  ₹{Math.round(distance * (selectedVehicle?.perKmRate || 11))}
                </span>
              </div>

              <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
                <div>
                  <span className="font-black text-slate-900 text-sm block">Total Estimated Fare</span>
                  <span className="text-[10px] text-gray-400">Includes toll guidance, no hidden costs</span>
                </div>
                <span className="text-3xl font-black text-orange-600">₹{totalFare}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-3xl border border-orange-100 space-y-3 text-xs">
            <h4 className="font-extrabold text-orange-950 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-orange-600" /> Bihar Cabs Promise
            </h4>
            <p className="text-gray-600 leading-relaxed text-[11px]">
              Direct dispatch service across Patna, Gaya, Muzaffarpur, Darbhanga and nearby districts. Admin monitors all active rides with continuous dispatch support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
