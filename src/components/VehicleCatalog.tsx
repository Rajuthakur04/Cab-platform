import React, { useState } from 'react';
import { Vehicle, VehicleTier } from '../types';
import { Luggage, Users, Settings, Sparkles, Car, Fuel } from 'lucide-react';

interface VehicleCatalogProps {
  vehicles: Vehicle[];
  setCurrentTab: (tab: string) => void;
  onSelectVehicle?: (vehicle: Vehicle) => void;
}

export const VehicleCatalog: React.FC<VehicleCatalogProps> = ({
  vehicles,
  setCurrentTab,
  onSelectVehicle,
}) => {
  const [selectedTier, setSelectedTier] = useState<VehicleTier | 'All'>('All');

  const tiers: (VehicleTier | 'All')[] = ['All', 'Economy', 'Sedan', 'SUV', 'Luxury'];

  const filteredVehicles = vehicles.filter(
    (v) => selectedTier === 'All' || v.tier === selectedTier
  );

  const handleBook = (vehicle: Vehicle) => {
    if (onSelectVehicle) {
      onSelectVehicle(vehicle);
    }
    setCurrentTab('book');
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 select-none">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-orange-700 bg-orange-50 border border-orange-200/70 px-3 py-1 rounded-full uppercase tracking-wider mb-2.5 inline-block">
            Commercial Fleet
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight font-display">
            Bihar Cabs Fleet & Pricing
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Browse our wide car collection matching every local or inter-district journey across Bihar.
          </p>
        </div>

        {/* Tier filter selector */}
        <div className="flex flex-wrap items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
          {tiers.map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition duration-150 select-none cursor-pointer ${
                selectedTier === tier
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-100'
                  : 'text-gray-600 hover:bg-white hover:text-orange-600'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredVehicles.map((v) => (
          <div
            key={v.id}
            className={`bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 select-none flex flex-col justify-between ${
              !v.available ? 'opacity-85 grayscale-[30%]' : ''
            }`}
          >
            <div>
              {/* Card visual banner */}
              <div className="h-52 w-full relative overflow-hidden bg-gray-50">
                <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 flex gap-1.5">
                  <span className="text-xs bg-black/70 backdrop-blur-md text-white font-bold px-3 py-1 rounded-xl">
                    {v.tier}
                  </span>
                  {v.fuelType && (
                    <span className="text-xs bg-orange-600/90 text-white font-bold px-2.5 py-1 rounded-xl font-mono flex items-center gap-1">
                      <Fuel className="w-3 h-3" /> {v.fuelType}
                    </span>
                  )}
                  {!v.available && (
                    <span className="text-xs bg-red-600/90 text-white font-bold px-3 py-1 rounded-xl">
                      Fully Booked
                    </span>
                  )}
                </div>
              </div>

              {/* Specs & pricing details */}
              <div className="p-6">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-lg font-black text-slate-900 leading-tight">
                    {v.name}
                  </h3>
                  <div className="text-right">
                    <span className="block text-[11px] font-bold text-gray-400 leading-tight">Base Price</span>
                    <span className="text-sm font-black text-slate-800">₹{v.baseFare}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mb-4 select-none">
                  <span className="text-xs text-orange-600 font-black">₹{v.perKmRate}/km</span>
                  <span className="text-xs text-gray-400 font-medium">Extra travel cost</span>
                  {v.registrationNumber && (
                    <span className="text-[10px] text-gray-400 font-mono ml-auto bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                      {v.registrationNumber}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5 border-t border-gray-50 pt-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-600 select-none">
                    <Users className="w-4 h-4 text-orange-500" />
                    <span>Up to {v.seats} Travelers</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-600 select-none">
                    <Luggage className="w-4 h-4 text-orange-500" />
                    <span>{v.luggage} Luggage bags</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-600 select-none">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                    <span>{v.ac ? 'Air Conditioned' : 'Non AC'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-600 select-none">
                    <Settings className="w-4 h-4 text-orange-500" />
                    <span>{v.transmission} Drive</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions for bookings */}
            <div className="p-6 pt-0 mt-auto border-t border-gray-50 bg-gray-50/20">
              {v.available ? (
                <button
                  onClick={() => handleBook(v)}
                  className="w-full py-3.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-black text-xs rounded-2xl transition shadow-md shadow-orange-100 flex items-center justify-center gap-2 cursor-pointer select-none"
                >
                  <Car className="w-4 h-4" /> Book This Model
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-3.5 bg-gray-200 text-gray-400 font-bold text-xs rounded-2xl transition cursor-not-allowed select-none"
                >
                  Fully Booked / In Service
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
