import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, LogIn, UserCheck } from 'lucide-react';
import { User as UserType } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: UserType) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'login') {
      if (!email.trim() || !password) {
        setError('Please enter both email address and password.');
        return;
      }

      const cleanEmail = email.trim().toLowerCase();

      // 1. Built-in Admin Account
      if (cleanEmail === 'admin@biharcabs.in' && password === 'admin') {
        onLoginSuccess({
          id: 'admin1',
          name: 'Admin Bihar Cabs',
          email: 'admin@biharcabs.in',
          phone: '9308874698',
          role: 'admin',
        });
        onClose();
        return;
      }

      // 2. Built-in Demo Customer Account
      if (cleanEmail === 'customer@biharcabs.in' && password === 'customer') {
        onLoginSuccess({
          id: 'cust1',
          name: 'Rajesh Kumar',
          email: 'customer@biharcabs.in',
          phone: '9876543210',
          role: 'customer',
        });
        onClose();
        return;
      }

      // 3. User accounts registered in LocalStorage
      const usersData: UserType[] = JSON.parse(localStorage.getItem('bihar_cabs_users') || '[]');
      const user = usersData.find(
        (u) => u.email.toLowerCase() === cleanEmail && (!u.password || u.password === password)
      );

      if (user) {
        onLoginSuccess(user);
        onClose();
      } else {
        setError('Invalid email or password. Please verify your credentials or create a new account.');
      }
    } else {
      // Sign Up validation (Customer Account only)
      if (!name.trim() || !phone.trim() || !email.trim() || !password) {
        setError('Please fill in all details to create your account.');
        return;
      }

      const cleanEmail = email.trim().toLowerCase();

      // Check if user already exists
      const usersData: UserType[] = JSON.parse(localStorage.getItem('bihar_cabs_users') || '[]');
      if (usersData.some((u) => u.email.toLowerCase() === cleanEmail)) {
        setError('An account with this email already exists. Please sign in instead.');
        return;
      }

      // Role is strictly 'customer' for all public registrations
      const newUser: UserType = {
        id: 'u_' + Math.random().toString(36).substr(2, 9),
        name: name.trim(),
        email: cleanEmail,
        phone: phone.trim(),
        role: 'customer',
        password,
      };

      usersData.push(newUser);
      localStorage.setItem('bihar_cabs_users', JSON.stringify(usersData));

      onLoginSuccess(newUser);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 px-4">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl overflow-hidden animate-fadeIn flex flex-col max-h-[92vh] border border-slate-100">
        {/* Header */}
        <div className="flex justify-between items-center p-5 sm:p-6 bg-slate-50/80 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <LogIn className="w-5 h-5 text-orange-600" />
              {activeTab === 'login' ? 'Welcome Back' : 'Create Customer Account'}
            </h3>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Travel comfortably within Bihar's districts
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-2xl hover:bg-gray-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/60 p-1.5 gap-1.5">
          <button
            onClick={() => {
              setActiveTab('login');
              setError('');
            }}
            className={`flex-1 py-2.5 text-xs font-black rounded-xl text-center transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white text-orange-600 shadow-sm border border-orange-100'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setActiveTab('register');
              setError('');
            }}
            className={`flex-1 py-2.5 text-xs font-black rounded-xl text-center transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'bg-white text-orange-600 shadow-sm border border-orange-100'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Create Account
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-bold animate-shake select-none">
                {error}
              </div>
            )}

            {/* Registration Fields */}
            {activeTab === 'register' && (
              <>
                {/* Fixed User/Customer Account Indicator */}
                <div className="flex items-center gap-2 px-3 py-2 bg-orange-50/70 border border-orange-200/60 rounded-xl text-xs text-orange-800 font-bold select-none">
                  <UserCheck className="w-4 h-4 text-orange-600" />
                  <span>Account Type: Customer / Passenger</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="e.g. Anand Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-black text-xs rounded-xl transition duration-200 shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              {activeTab === 'login' ? 'Sign In Now' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
