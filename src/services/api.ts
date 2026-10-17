// MERN Stack Service Layer for Bihar Cabs
// Seamlessly connects with Express/MongoDB when running, or local storage persistence fallback

const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'https://bihar-cabs-api.onrender.com/api';

export const apiService = {
  // Check if MERN backend server is running
  checkBackendHealth: async (): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/health`, { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Auth
  login: async (credentials: { email: string; password: string }) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) throw new Error('Login failed');
      return await res.json();
    } catch {
      return null;
    }
  },

  // Vehicles
  getVehicles: async () => {
    try {
      const res = await fetch(`${API_BASE}/vehicles`);
      if (!res.ok) throw new Error('Fetch failed');
      return await res.json();
    } catch {
      return null;
    }
  },

  // Bookings
  createBooking: async (bookingData: unknown) => {
    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      if (!res.ok) throw new Error('Booking creation failed');
      return await res.json();
    } catch {
      return null;
    }
  },

  // Notifications
  getNotifications: async () => {
    try {
      const res = await fetch(`${API_BASE}/notifications`);
      if (!res.ok) throw new Error('Notifications fetch failed');
      return await res.json();
    } catch {
      return null;
    }
  },
};
