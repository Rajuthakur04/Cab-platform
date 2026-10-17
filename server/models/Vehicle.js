import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    tier: { type: String, enum: ['Economy', 'Sedan', 'SUV', 'Luxury'], required: true },
    seats: { type: Number, required: true },
    luggage: { type: Number, required: true },
    perKmRate: { type: Number, required: true },
    baseFare: { type: Number, required: true },
    available: { type: Boolean, default: true },
    image: { type: String, required: true },
    ac: { type: Boolean, default: true },
    transmission: { type: String, enum: ['Manual', 'Automatic'], default: 'Manual' },
    registrationNumber: { type: String },
    fuelType: { type: String, enum: ['CNG', 'Diesel', 'Petrol', 'Electric'], default: 'CNG' },
  },
  { timestamps: true }
);

export const Vehicle = mongoose.model('Vehicle', vehicleSchema);
