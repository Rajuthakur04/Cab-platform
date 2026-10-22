import React, { useState } from 'react';
import { Shield, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import { User } from '../types';
import { apiService } from '../services/api';

interface AdminLoginGateProps {
  onLoginSuccess: (user: User) => void;
  onCancel: () => void;
}

export const AdminLoginGate: React.FC<AdminLoginGateProps> = ({ onLoginSuccess, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both admin email and password.');
      return;
    }

    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      // 1. Try Backend API login
      const remoteUser = await apiService.login({ email: cleanEmail, password });
      if (remoteUser && remoteUser.role === 'admin') {
        setLoading(false);
        onLoginSuccess(remoteUser);
        return;
      }
    } catch {
      // Fallback to local credential verification
    }

    // 2. Built-in Admin verification
    if (cleanEmail === 'admin@biharcabs.in' && password === 'admin') {
      setLoading(false);
      onLoginSuccess({
        id: 'admin1',
        name: 'Admin Bihar Cabs',
        email: 'admin@biharcabs.in',
        phone: '9308874698',
        role: 'admin',
      });
      return;
    }

    setLoading(false);
    setError('Invalid email or password. Access restricted to authorized administrators only.');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Back Link */}
        <button
          onClick={onCancel}
          className="mb-4 inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-orange-600 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 p-6 sm:p-8 text-white relative">
            <div className="w-14 h-14 rounded-2xl bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400 mb-4 shadow-inner">
              <Shield className="w-7 h-7" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Admin Portal Login
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium leading-relaxed">
              Enter your credentials to access the secure administrative dashboard.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-red-700 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Admin Email ID
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="admin@biharcabs.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium transition"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black text-sm rounded-xl transition duration-200 shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-95"
            >
              <Shield className="w-4 h-4" />
              {loading ? 'Authenticating...' : 'Sign In to Admin Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
