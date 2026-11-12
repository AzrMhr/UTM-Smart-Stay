export type CampusId = 'all' | 'jb' | 'kl' | 'pagoh';

export interface RoomItem {
  id: string;
  propertyId: string;
  propertyName: string;
  campusId: 'jb' | 'kl' | 'pagoh';
  roomNo: string; // e.g. '502', '401', '12-03-A'
  floor: number;
  block?: string;
  unitNo?: string; // for apartments e.g. 'Unit 12-03'
  roomType: string;
  category: 'kolej_room' | 'studio' | 'twin_studio' | 'apartment_room';
  isMasterRoom?: boolean;
  capacity: number;
  status: 'available' | 'held' | 'booked' | 'maintenance';
  heldUntil?: string;
  priceMonth: number;
  priceSemester: number;
  depositAmount: number;
  bedType: 'Single Bed' | 'Double Bed' | 'Twin Bed';
  features: string[]; // e.g. 'Balcony', 'Corner Room', 'Air-Conditioned', 'Attached Bath'
  genderRestriction?: 'Male Only' | 'Female Only' | 'Co-ed';
  notes?: string;
  unitContext?: {
    unitNo: string;
    totalBedrooms: number;
    otherRooms: {
      roomNo: string;
      label: string;
      status: 'available' | 'booked' | 'held';
      occupantBrief?: string;
    }[];
  };
}

export interface RoomProperty {
  id: string;
  name: string;
  shortCode: string;
  campusId: 'jb' | 'kl' | 'pagoh';
  campusName: string;
  roomType: string;
  subtitle?: string;
  bedType: 'Single Bed' | 'Double Bed' | 'Twin Bed';
  capacity: string;
  floor: string;
  priceMonth: number;
  priceSemester: number;
  depositAmount: number;
  availableUnits: number;
  totalUnits: number;
  statusBadge: 'Available Now' | 'Waitlist Open' | 'Limited Units';
  waitlistCount?: number;
  rating: number;
  reviewCount: number;
  imageTheme: string;
  facilities: string[];
  description: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  genderRestriction?: 'Male Only' | 'Female Only' | 'Co-ed Block';
  distanceToFaculty?: string;
  floorsCount?: number;
}

export interface StudentUser {
  id: string;
  fullName: string;
  phone: string;
  matricNo: string;
  email: string;
  faculty: string;
  campus: string;
  gender: string;
  avatarUrl?: string;
}

export interface BookingRecord {
  id: string;
  bookingCode: string;
  propertyId: string;
  propertyName: string;
  roomId?: string;
  roomNo?: string;
  floor?: number;
  block?: string;
  roomType: string;
  campusName: string;
  studentName: string;
  studentPhone: string;
  studentMatric: string;
  bookingPeriod: string;
  amountMonth: number;
  amountPaid: number;
  depositPaid: number;
  paymentMethod: 'FPX Online Banking (Maybank2u / CIMB / Bank Islam)' | 'Credit / Debit Card (Visa/Mastercard)';
  status: 'confirmed' | 'pending_payment' | 'waitlisted' | 'cancelled';
  createdAt: string;
  expiresAt: string; // for 15-min hold timer
}

export interface WaitlistRecord {
  id: string;
  propertyId: string;
  propertyName: string;
  studentName: string;
  studentMatric: string;
  studentPhone: string;
  position: number;
  estimatedWaitDays: number;
  joinedAt: string;
  status: 'queued' | 'offered' | 'expired';
}

export interface RoommateListing {
  id: string;
  studentName: string;
  matricNo: string;
  faculty: string;
  targetResidence: string;
  lifestyle: string[];
  budgetRange: string;
  description: string;
  postedDate: string;
  contactPhone: string;
}

export interface CarpoolListing {
  id: string;
  driverName: string;
  route: string;
  departureTime: string;
  days: string;
  seatsAvailable: number;
  farePerTrip: string;
  vehicle: string;
}

export interface ChatMessage {
  id: string;
  sender: 'student' | 'officer' | 'system';
  text: string;
  time: string;
}

export interface MessageThread {
  id: string;
  recipientName: string;
  role: string;
  unreadCount: number;
  lastMessage: string;
  lastTime: string;
  messages: ChatMessage[];
}

export interface PointOfInterest {
  id: string;
  name: string;
  category: 'college' | 'faculty' | 'gate' | 'bus_stop';
  campusId: 'jb' | 'kl' | 'pagoh';
  x: number; // percentage on map diagram
  y: number; // percentage on map diagram
  description: string;
}
