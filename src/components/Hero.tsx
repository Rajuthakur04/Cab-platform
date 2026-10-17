import React from 'react';
import { ShieldCheck, Navigation, Award, ArrowRight } from 'lucide-react';
import { DISTRICTS } from '../data/mockData';

interface HeroProps {
  setCurrentTab: (tab: string) => void;
  onOpenAuth: () => void;
  isLoggedIn: boolean;
}

export const Hero: React.FC<HeroProps> = ({ setCurrentTab, onOpenAuth, isLoggedIn }) => {
  return (
    <div className="bg-gradient-to-b from-white to-orange-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Hero Text / CTA */}
          <div className="space-y-5 sm:space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100/80 border border-orange-200 rounded-full text-xs font-bold text-orange-700 tracking-wide select-none">
              <Navigation className="w-3.5 h-3.5 text-orange-600" />
              Trusted across 12 Bihar Districts
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight select-none">
              Premier Car Rentals
              <br />
              & Local <span className="text-orange-600">Bihar Cabs</span>
            </h1>

            <p className="text-base text-gray-600 max-w-xl leading-relaxed select-none">
              Affordable, transparent pricing with well-maintained cars. Travel from Patna to Muzaffarpur, Gaya, Darbhanga, or hire a local rental by the hour.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 items-center">
              <button
                onClick={() => setCurrentTab('book')}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-extrabold rounded-2xl shadow-lg shadow-orange-200 transition duration-200 transform hover:-translate-y-0.5 cursor-pointer"
              >
                Book Your Ride Now
                <ArrowRight className="w-5 h-5" />
              </button>

              {!isLoggedIn && (
                <button
                  onClick={onOpenAuth}
                  className="px-6 py-3.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 hover:text-orange-600 font-extrabold rounded-2xl transition shadow-sm hover:border-orange-100 cursor-pointer"
                >
                  Create an Account
                </button>
              )}
            </div>

            {/* Trust factors */}
            <div className="flex flex-wrap items-center gap-6 pt-2 select-none">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                <ShieldCheck className="w-4 h-4 text-orange-600" />
                Verified Drivers
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                <Navigation className="w-4 h-4 text-orange-600" />
                Exact Distances
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                <Award className="w-4 h-4 text-orange-600" />
                Highest Safety
              </div>
            </div>
          </div>

          {/* Right Visual Banner - Exactly matches screenshot */}
          <div className="relative flex justify-center items-center">
            <div className="w-full h-[380px] rounded-3xl overflow-hidden shadow-2xl relative select-none">
              <img
                src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80"
                alt="Bihar Cabs - Fleet Selection"
                className="w-full h-full object-cover rounded-3xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

              {/* In-image highlights */}
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div>
                  <h3 className="text-xl font-bold text-white leading-tight">
                    Clean, Safe Fleet
                  </h3>
                  <p className="text-xs text-orange-200 mt-1">
                    Sedans, SUVs, and luxury multi-purpose vehicles
                  </p>
                </div>
                <div className="bg-white/95 px-3 py-1.5 rounded-xl border border-white/20 text-center flex flex-col justify-center select-none shadow">
                  <span className="text-[10px] text-slate-500 font-bold leading-none uppercase">Starts At</span>
                  <span className="text-lg font-black text-orange-600">₹11/km</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Banner - Exactly matches screenshot */}
        <div className="mt-16 bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            <div className="text-center md:text-left border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-4">
              <h4 className="text-xs font-extrabold text-orange-600 uppercase tracking-widest select-none">
                Districts Covered
              </h4>
              <p className="text-2xl font-black text-slate-800 mt-1 select-none">12 Districts</p>
              <p className="text-xs text-slate-500 font-medium select-none">All nearby regions in Bihar</p>
            </div>
            <div className="text-center md:text-left border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-4">
              <h4 className="text-xs font-extrabold text-orange-600 uppercase tracking-widest select-none">
                Reliability
              </h4>
              <p className="text-2xl font-black text-slate-800 mt-1 select-none">99.2% On-Time</p>
              <p className="text-xs text-slate-500 font-medium select-none">Trusted & fast pick-up</p>
            </div>
            <div className="text-center md:text-left border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-4">
              <h4 className="text-xs font-extrabold text-orange-600 uppercase tracking-widest select-none">
                Service Options
              </h4>
              <p className="text-2xl font-black text-slate-800 mt-1 select-none">Inter-District</p>
              <p className="text-xs text-slate-500 font-medium select-none">Point-to-point car rental</p>
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-xs font-extrabold text-orange-600 uppercase tracking-widest select-none">
                Customer Support
              </h4>
              <p className="text-2xl font-black text-slate-800 mt-1 select-none">24x7 Help</p>
              <p className="text-xs text-slate-500 font-medium select-none">Local phone line support</p>
            </div>
          </div>
        </div>

        {/* Major Routes in Bihar List */}
        <div className="mt-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight select-none">
              Travel across Prominent Districts
            </h2>
            <p className="text-sm text-gray-500 mt-2 select-none">
              Explore point-to-point transparent cab routes, connecting ancient cities and industrial hubs alike.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {DISTRICTS.slice(0, 4).map((d, index) => (
              <div
                key={d.id}
                className="bg-white hover:bg-orange-50/20 border border-gray-100 rounded-2xl p-5 hover:border-orange-200 transition group select-none flex flex-col justify-between"
              >
                <div>
                  <div className="text-2xl mb-3 group-hover:scale-110 duration-200 transition w-fit">
                    {index === 0 && '🏛️'}
                    {index === 1 && '🌾'}
                    {index === 2 && '🙏'}
                    {index === 3 && '🧵'}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-orange-600 transition">
                    {d.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 font-medium">{d.description}</p>
                </div>
                <div className="mt-4 border-t border-gray-50 pt-3 flex justify-between items-center text-xs">
                  <span className="text-orange-600 font-semibold">{d.region} Region</span>
                  <button
                    onClick={() => setCurrentTab('book')}
                    className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    Go there <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
