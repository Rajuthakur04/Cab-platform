import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from './models/User.js';
import { Vehicle } from './models/Vehicle.js';
import { Booking } from './models/Booking.js';
import { Notification } from './models/Notification.js';
import { Driver } from './models/Driver.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bihar_cabs';

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB: bihar_cabs database'))
  .catch((err) => console.log('⚠️ MongoDB connection warning (standalone mode available):', err.message));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Bihar Cabs MERN API', timestamp: new Date() });
});

// AUTH ROUTES
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === 'admin@biharcabs.in' && password === 'admin') {
      return res.json({
        id: 'admin1',
        name: 'Bihar Cabs Central Admin',
        email: 'admin@biharcabs.in',
        phone: '9876543210',
        role: 'admin',
      });
    }

    if (email === 'customer@biharcabs.in' && password === 'customer') {
      return res.json({
        id: 'cust1',
        name: 'Rajesh Kumar',
        email: 'customer@biharcabs.in',
        phone: '9876543210',
        role: 'customer',
      });
    }

    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials or user not found' });
    }
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered.' });
    }
    const user = new User({ name, email, phone, password, role: role || 'customer' });
    await user.save();
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// VEHICLES ROUTES
app.get('/api/vehicles', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/vehicles', async (req, res) => {
  try {
    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/vehicles/:id', async (req, res) => {
  try {
    const updated = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/vehicles/:id', async (req, res) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ message: 'Vehicle removed from fleet' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// BOOKINGS ROUTES
app.get('/api/bookings', async (req, res) => {
  try {
    const { userId } = req.query;
    const query = userId ? { userId } : {};
    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();

    // Auto create notification for admin
    const notif = new Notification({
      title: '🚖 New Ride Booking Received',
      message: `${booking.userName} booked ride: ${booking.pickupDistrictId} to ${booking.dropoffDistrictId} (₹${booking.totalFare})`,
      type: 'booking_new',
      bookingId: booking._id.toString(),
      targetRole: 'admin',
    });
    await notif.save();

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/bookings/:id', async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/bookings/:id/status', async (req, res) => {
  try {
    const { status, driver } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (driver) updateData.driver = driver;
    const updated = await Booking.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/bookings/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// NOTIFICATIONS ROUTES
app.get('/api/notifications', async (req, res) => {
  try {
    const { role, userId } = req.query;
    const query = {};
    if (role) query.targetRole = role;
    if (userId) query.userId = userId;

    const notifs = await Notification.find(query).sort({ createdAt: -1 });
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/notifications/read-all', async (req, res) => {
  try {
    await Notification.updateMany({ read: false }, { read: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DRIVERS ROUTES
app.get('/api/drivers', async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Bihar Cabs MERN Backend Server running on port ${PORT}`);
});
