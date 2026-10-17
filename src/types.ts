export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  password?: string;
}

export type DistrictId =
  | 'patna'
  | 'muzaffarpur'
  | 'gaya'
  | 'bhagalpur'
  | 'darbhanga'
  | 'arrah'
  | 'begusarai'
  | 'purnia'
  | 'sasaram'
  | 'chapra'
  | 'nalanda'
  | 'madhubani'
  | 'motihari'
  | 'munger'
  | 'saharsa'
  | 'samastipur'
  | 'katihar'
  | 'siwan';

export interface District {
  id: DistrictId;
  name: string;
  description: string;
  region: string;
}

export type VehicleTier = 'Economy' | 'Sedan' | 'SUV' | 'Luxury';

export interface Vehicle {
  id: string;
  name: string;
  tier: VehicleTier;
  seats: number;
  luggage: number;
  perKmRate: number;
  baseFare: number;
  available: boolean;
  image: string;
  ac: boolean;
  transmission: 'Manual' | 'Automatic';
  registrationNumber?: string;
  fuelType?: 'CNG' | 'Diesel' | 'Petrol' | 'Electric';
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  pickupDistrictId: DistrictId;
  dropoffDistrictId: DistrictId | 'local';
  localDurationHours?: number;
  bookingType: 'inter-district' | 'local';
  vehicleId: string;
  pickupDateTime: string;
  distanceKm: number;
  totalFare: number;
  status: BookingStatus;
  createdAt: string;
  paymentMethod?: 'Cash' | 'UPI';
  paymentStatus?: 'Pending' | 'Paid';
  driverName?: string;
  driverPhone?: string;
  vehicleNumber?: string;
  otp?: string;
  notes?: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  district: string;
  vehicleNumber: string;
  rating: number;
  totalTrips: number;
  status: 'Available' | 'On Trip' | 'Off Duty';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'booking_new' | 'booking_status' | 'driver_assigned' | 'system';
  bookingId?: string;
  read: boolean;
  createdAt: string;
  targetRole: 'admin' | 'customer';
  userId?: string;
}
