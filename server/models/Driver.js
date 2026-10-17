import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    district: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    rating: { type: Number, default: 4.8 },
    totalTrips: { type: Number, default: 0 },
    status: { type: String, enum: ['Available', 'On Trip', 'Off Duty'], default: 'Available' },
  },
  { timestamps: true }
);

export const Driver = mongoose.model('Driver', driverSchema);
