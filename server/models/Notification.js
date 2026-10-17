import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['booking_new', 'booking_status', 'driver_assigned', 'system'],
      default: 'system',
    },
    bookingId: { type: String },
    read: { type: Boolean, default: false },
    targetRole: { type: String, enum: ['admin', 'customer'], default: 'admin' },
    userId: { type: String },
  },
  { timestamps: true }
);

export const Notification = mongoose.model('Notification', notificationSchema);
