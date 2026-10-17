import React from 'react';
import { Car, MapPin, Phone, Mail, Shield } from 'lucide-react';
import { DISTRICTS } from '../data/mockData';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
  onAdminLoginClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab, onAdminLoginClick }) => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About column */}
        <div>
          <div className="flex items-center space-x-2 text-white mb-4">
            <div className="bg-gradient-to-tr from-orange-600 to-amber-500 p-1.5 rounded-lg">
              <Car className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">Bihar Cabs</span>
          </div>
          <p className="text-sm text-gray-400 mb-4 leading-relaxed">
            Your premier local travel partner, serving 12 major districts across the state of Bihar. Dedicated to comfortable, fast, and affordable rides.
          </p>
          <div className="flex items-center space-x-4">
            <span className="text-xs bg-orange-600/10 border border-orange-500/20 px-2 py-1 rounded text-orange-400 font-medium select-none">
              Safe & Sanitized
            </span>
            <span className="text-xs bg-orange-600/10 border border-orange-500/20 px-2 py-1 rounded text-orange-400 font-medium select-none">
              24/7 Service
            </span>
          </div>
        </div>

        {/* Districts served in Bihar */}
        <div>
          <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider select-none">
            Popular Districts
          </h4>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4">
            {DISTRICTS.slice(0, 8).map((d) => (
              <span
                key={d.id}
                className="text-xs text-gray-400 hover:text-orange-400 cursor-default select-none flex items-center gap-1 transition"
              >
                <MapPin className="w-3 h-3 text-orange-500" />
                {d.name}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider select-none">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <button
                onClick={() => setCurrentTab('home')}
                className="hover:text-orange-400 transition cursor-pointer"
              >
                Home & Specials
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentTab('vehicles')}
                className="hover:text-orange-400 transition cursor-pointer"
              >
                Vehicle Fleet
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentTab('book')}
                className="hover:text-orange-400 transition cursor-pointer"
              >
                Direct Ride Booking
              </button>
            </li>
            <li>
              <button
                onClick={onAdminLoginClick}
                className="hover:text-orange-400 text-orange-400/90 font-medium transition flex items-center gap-1.5 cursor-pointer pt-1"
              >
                <Shield className="w-3.5 h-3.5 text-orange-500" />
                Admin Login
              </button>
            </li>
          </ul>
        </div>

        {/* Support & Contact */}
        <div>
          <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider select-none">
            Help & Contacts
          </h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-orange-500" />
              <a href="tel:+919308874698" className="hover:text-orange-400 transition font-medium">
                +91 9308874698
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-orange-500" />
              <span>support@biharcabs.in</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-orange-500 mt-1" />
              <span>Station Road, Teghra, Bihar, 800001</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-10 pt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 select-none gap-3">
        <div>
          &copy; {new Date().getFullYear()} Bihar Cabs Platform. Proudly serving all nearby districts in Bihar. All rights reserved.
        </div>
        <div>
          <button
            onClick={onAdminLoginClick}
            className="text-gray-400 hover:text-orange-400 transition flex items-center gap-1 cursor-pointer"
          >
            <Shield className="w-3 h-3 text-orange-500" /> Administrator Login
          </button>
        </div>
      </div>
    </footer>
  );
};
