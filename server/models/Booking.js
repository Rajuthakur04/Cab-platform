import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userPhone: { type: String, required: true },
    pickupDistrictId: { type: String, required: true },
    dropoffDistrictId: { type: String, required: true },
    localDurationHours: { type: Number },
    bookingType: { type: String, enum: ['inter-district', 'local'], required: true },
    vehicleId: { type: String, required: true },
    pickupDateTime: { type: String, required: true },
    distanceKm: { type: Number, required: true },
    totalFare: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    paymentMethod: { type: String, enum: ['Cash', 'UPI'], default: 'Cash' },
    paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
    driverName: { type: String },
    driverPhone: { type: String },
    vehicleNumber: { type: String },
    otp: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Booking = mongoose.model('Booking', bookingSchema);
