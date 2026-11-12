import {
  RoomProperty,
  RoomItem,
  StudentUser,
  BookingRecord,
  WaitlistRecord,
  RoommateListing,
  CarpoolListing,
  MessageThread,
  PointOfInterest,
} from '../types';

export const CURRENT_STUDENT: StudentUser = {
  id: 'usr-azraf-01',
  fullName: 'Azraf Mahir',
  phone: '+60123456789',
  matricNo: 'A24MJ3028',
  email: 'azraf.mahir@graduate.utm.my',
  faculty: 'MJIIT (Software Engineering)',
  campus: 'Kuala Lumpur',
  gender: 'Male',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
};

export const INITIAL_PROPERTIES: RoomProperty[] = [
  {
    id: 'ktdi-jb-01',
    name: 'Kolej Tun Dr. Ismail',
    shortCode: 'KTDI',
    campusId: 'jb',
    campusName: 'Johor Bahru Campus',
    roomType: 'Single Room',
    subtitle: 'Johor Bahru Campus • Single Room',
    bedType: 'Single Bed',
    capacity: '1 Student',
    floor: 'Block M-04, 2nd Floor',
    priceMonth: 450,
    priceSemester: 2250,
    depositAmount: 200,
    availableUnits: 4,
    totalUnits: 120,
    statusBadge: 'Available Now',
    rating: 4.8,
    reviewCount: 142,
    imageTheme: 'ktdi',
    facilities: [
      'High-Speed Campus Wi-Fi',
      'Ergonomic Study Desk & Chair',
      'Personal Wardrobe & Locker',
      'Ceiling Fan & Cross Ventilation',
      'Shared Bathroom (Clean Daily)',
      'Common Pantry with Microwave',
      'Coin-operated Laundry Center',
      '24/7 Security & CCTV',
    ],
    description:
      'Kolej Tun Dr. Ismail (KTDI) offers quiet, conducive single rooms within walking distance to the Faculty of Computing (FC) and Faculty of Electrical Engineering (FKE). Features lush green surrounding and dedicated study lounges.',
    address: 'Kolej Tun Dr. Ismail, Universiti Teknologi Malaysia, 81310 Skudai, Johor',
    coordinates: { lat: 1.5583, lng: 103.6391 },
    genderRestriction: 'Co-ed Block',
    distanceToFaculty: '5 min walk to Computing / FKE',
  },
  {
    id: 'ksj-kl-02',
    name: 'Kolej Siswa Jaya (KSJ)',
    shortCode: 'KSJ',
    campusId: 'kl',
    campusName: 'Kuala Lumpur Campus',
    roomType: 'Shared Twin',
    subtitle: 'Kuala Lumpur Campus • Shared Twin',
    bedType: 'Twin Bed',
    capacity: '2 Students',
    floor: 'Block B, 5th Floor',
    priceMonth: 300,
    priceSemester: 1500,
    depositAmount: 150,
    availableUnits: 0,
    totalUnits: 250,
    statusBadge: 'Waitlist Open',
    waitlistCount: 3,
    rating: 4.7,
    reviewCount: 98,
    imageTheme: 'ksj',
    facilities: [
      'High-Speed Wi-Fi',
      'Air Conditioning & Ceiling Fan',
      'Dual Study Desks with Reading Lamps',
      'Attached En-suite Bathroom',
      'Gym & Student Recreational Hall',
      'Frequent Shuttle Bus to UTM KL / MJIIT',
      'Cafeteria & Convenience Mart',
      'Card Access Security Gate',
    ],
    description:
      'Kolej Siswa Jaya (KSJ) is the premier residential college for UTM Kuala Lumpur and MJIIT students. Located in Setiawangsa with express dedicated UTM shuttle buses to campus every 15 minutes.',
    address: 'Kolej Siswa Jaya, Jalan Rejang, Setapak Jaya, 54100 Kuala Lumpur',
    coordinates: { lat: 3.1932, lng: 101.7335 },
    genderRestriction: 'Male Only',
    distanceToFaculty: '10 min direct shuttle to MJIIT',
  },
  {
    id: 'krp-jb-03',
    name: 'Kolej Rahman Putra (KRP)',
    shortCode: 'KRP',
    campusId: 'jb',
    campusName: 'Johor Bahru Campus',
    roomType: 'Deluxe Single with Balcony',
    bedType: 'Single Bed',
    capacity: '1 Student',
    floor: 'Block A, 3rd Floor',
    priceMonth: 480,
    priceSemester: 2400,
    depositAmount: 200,
    availableUnits: 6,
    totalUnits: 90,
    statusBadge: 'Available Now',
    rating: 4.6,
    reviewCount: 76,
    imageTheme: 'krp',
    facilities: [
      'Campus Wi-Fi',
      'Private Balcony with Campus View',
      'Study Workstation',
      'En-suite Washroom',
      'Recreation Court',
      'Cafeteria & Mini Market',
    ],
    description:
      'Kolej Rahman Putra (KRP) is known for its spacious rooms and vibrant student activities. Situated adjacent to the UTM Sports Complex and Olympic-sized swimming pool.',
    address: 'Kolej Rahman Putra, Universiti Teknologi Malaysia, 81310 Skudai, Johor',
    coordinates: { lat: 1.562, lng: 103.635 },
    genderRestriction: 'Co-ed Block',
    distanceToFaculty: '7 min walk to UTM Sports Complex',
  },
  {
    id: 'kdse-jb-04',
    name: 'Kolej Datin Seri Endon (KDSE)',
    shortCode: 'KDSE',
    campusId: 'jb',
    campusName: 'Johor Bahru Campus',
    roomType: 'Twin Sharing Standard',
    bedType: 'Twin Bed',
    capacity: '2 Students',
    floor: 'Block C, 2nd Floor',
    priceMonth: 320,
    priceSemester: 1600,
    depositAmount: 150,
    availableUnits: 8,
    totalUnits: 160,
    statusBadge: 'Available Now',
    rating: 4.5,
    reviewCount: 64,
    imageTheme: 'kdse',
    facilities: [
      'Wi-Fi Mesh',
      '2 Study Desks & Shelves',
      'Built-in Closets',
      'Ceiling Fans',
      'Water Dispenser & Pantry',
      'Night Study Room',
    ],
    description:
      'Convenient budget-friendly twin rooms close to the central library (Perpustakaan Sultanah Zanariah) and Dewan Sultan Iskandar.',
    address: 'Kolej Datin Seri Endon, Universiti Teknologi Malaysia, 81310 Skudai, Johor',
    coordinates: { lat: 1.565, lng: 103.642 },
    genderRestriction: 'Female Only',
    distanceToFaculty: '4 min walk to Central Library',
  },
  {
    id: 'res-kl-05',
    name: 'Residensi UTM KL (Gurney)',
    shortCode: 'R-UTMKL',
    campusId: 'kl',
    campusName: 'Kuala Lumpur Campus',
    roomType: 'Studio Suite (Partner Residence)',
    bedType: 'Double Bed',
    capacity: '1-2 Students',
    floor: 'Tower A, 12th Floor',
    priceMonth: 850,
    priceSemester: 4250,
    depositAmount: 500,
    availableUnits: 2,
    totalUnits: 45,
    statusBadge: 'Available Now',
    rating: 4.9,
    reviewCount: 110,
    imageTheme: 'reskl',
    facilities: [
      'Inverter Air Conditioning',
      'High Speed 500Mbps Fiber Wi-Fi',
      'Kitchenette & Refrigerator',
      'Swimming Pool & Sky Gym',
      'Smart Card Door Lock',
      'Direct Covered Walkway to UTM KL Gate',
    ],
    description:
      'High-tier partner residence right across Jalan Keramat Hujung and UTM KL campus entrance. Ideal for postgraduate researchers, MJIIT exchange students, and final year project teams.',
    address: 'Residensi UTM KL, Jalan Keramat Hujung, 54000 Kuala Lumpur',
    coordinates: { lat: 3.1725, lng: 101.7208 },
    genderRestriction: 'Co-ed Block',
    distanceToFaculty: '3 min walk to MJIIT building',
  },
  {
    id: 'pagoh-06',
    name: 'Pagoh Edu Hub Residential Complex',
    shortCode: 'PEHRC',
    campusId: 'pagoh',
    campusName: 'Pagoh Campus',
    roomType: 'Single Ensuite Room',
    bedType: 'Single Bed',
    capacity: '1 Student',
    floor: 'Wing 3, 1st Floor',
    priceMonth: 380,
    priceSemester: 1900,
    depositAmount: 180,
    availableUnits: 12,
    totalUnits: 150,
    statusBadge: 'Available Now',
    rating: 4.6,
    reviewCount: 52,
    imageTheme: 'pagoh',
    facilities: [
      'Edu Hub Wi-Fi Coverage',
      'Ensuite Bathroom with Water Heater',
      'Dedicated Workstation',
      'Shared Kitchenette per floor',
      'Bicycle Parking & Solar Paths',
      'Central Edu Hub Library Access',
    ],
    description:
      'Purpose-built modern student village at Bandar Universiti Pagoh shared with UTM, UTHM, and IIUM faculties. Modern green township architecture.',
    address: 'Kompleks Kediaman Pelajar Pagoh, Hab Pendidikan Tinggi Pagoh, 84600 Pagoh, Johor',
    coordinates: { lat: 2.1485, lng: 102.731 },
    genderRestriction: 'Co-ed Block',
    distanceToFaculty: '5 min bicycle ride to UTM Pagoh Campus',
  },
];

export const INITIAL_ROOMS: RoomItem[] = [
  // KTDI (Kolej Tun Dr. Ismail) Rooms
  {
    id: 'ktdi-501',
    propertyId: 'ktdi-jb-01',
    propertyName: 'Kolej Tun Dr. Ismail',
    campusId: 'jb',
    roomNo: '501',
    floor: 5,
    block: 'Block M-04',
    roomType: 'Single Room',
    category: 'kolej_room',
    capacity: 1,
    status: 'available',
    priceMonth: 450,
    priceSemester: 2250,
    depositAmount: 200,
    bedType: 'Single Bed',
    features: ['High Floor View', 'Near Study Lounge', 'High Speed Wi-Fi'],
  },
  {
    id: 'ktdi-502',
    propertyId: 'ktdi-jb-01',
    propertyName: 'Kolej Tun Dr. Ismail',
    campusId: 'jb',
    roomNo: '502',
    floor: 5,
    block: 'Block M-04',
    roomType: 'Single Room',
    category: 'kolej_room',
    capacity: 1,
    status: 'available',
    priceMonth: 450,
    priceSemester: 2250,
    depositAmount: 200,
    bedType: 'Single Bed',
    features: ['Balcony', 'Corner Room', 'Sunset View', 'Attached Sink'],
    notes: 'Premium top floor corner room with private balcony overlooking the Faculty of Computing trees.',
  },
  {
    id: 'ktdi-503',
    propertyId: 'ktdi-jb-01',
    propertyName: 'Kolej Tun Dr. Ismail',
    campusId: 'jb',
    roomNo: '503',
    floor: 5,
    block: 'Block M-04',
    roomType: 'Single Room',
    category: 'kolej_room',
    capacity: 1,
    status: 'booked',
    priceMonth: 450,
    priceSemester: 2250,
    depositAmount: 200,
    bedType: 'Single Bed',
    features: ['Study Desk', 'Built-in Closet'],
  },
  {
    id: 'ktdi-504',
    propertyId: 'ktdi-jb-01',
    propertyName: 'Kolej Tun Dr. Ismail',
    campusId: 'jb',
    roomNo: '504',
    floor: 5,
    block: 'Block M-04',
    roomType: 'Single Room',
    category: 'kolej_room',
    capacity: 1,
    status: 'held',
    heldUntil: 'In 8 minutes',
    priceMonth: 450,
    priceSemester: 2250,
    depositAmount: 200,
    bedType: 'Single Bed',
    features: ['Near Pantry', 'Cross Ventilation'],
  },
  {
    id: 'ktdi-401',
    propertyId: 'ktdi-jb-01',
    propertyName: 'Kolej Tun Dr. Ismail',
    campusId: 'jb',
    roomNo: '401',
    floor: 4,
    block: 'Block M-04',
    roomType: 'Single Room',
    category: 'kolej_room',
    capacity: 1,
    status: 'available',
    priceMonth: 450,
    priceSemester: 2250,
    depositAmount: 200,
    bedType: 'Single Bed',
    features: ['Quiet Corner', 'Ergonomic Desk', 'Fast Wi-Fi'],
    notes: 'Quiet 4th floor room favored by senior engineering students.',
  },
  {
    id: 'ktdi-402',
    propertyId: 'ktdi-jb-01',
    propertyName: 'Kolej Tun Dr. Ismail',
    campusId: 'jb',
    roomNo: '402',
    floor: 4,
    block: 'Block M-04',
    roomType: 'Single Room',
    category: 'kolej_room',
    capacity: 1,
    status: 'available',
    priceMonth: 450,
    priceSemester: 2250,
    depositAmount: 200,
    bedType: 'Single Bed',
    features: ['Garden View', 'Attached Wash Basin'],
  },
  {
    id: 'ktdi-403',
    propertyId: 'ktdi-jb-01',
    propertyName: 'Kolej Tun Dr. Ismail',
    campusId: 'jb',
    roomNo: '403',
    floor: 4,
    block: 'Block M-04',
    roomType: 'Single Room',
    category: 'kolej_room',
    capacity: 1,
    status: 'booked',
    priceMonth: 450,
    priceSemester: 2250,
    depositAmount: 200,
    bedType: 'Single Bed',
    features: ['Study Desk'],
  },
  {
    id: 'ktdi-404',
    propertyId: 'ktdi-jb-01',
    propertyName: 'Kolej Tun Dr. Ismail',
    campusId: 'jb',
    roomNo: '404',
    floor: 4,
    block: 'Block M-04',
    roomType: 'Single Room',
    category: 'kolej_room',
    capacity: 1,
    status: 'booked',
    priceMonth: 450,
    priceSemester: 2250,
    depositAmount: 200,
    bedType: 'Single Bed',
    features: ['Garden View'],
  },
  {
    id: 'ktdi-301',
    propertyId: 'ktdi-jb-01',
    propertyName: 'Kolej Tun Dr. Ismail',
    campusId: 'jb',
    roomNo: '301',
    floor: 3,
    block: 'Block M-04',
    roomType: 'Single Room',
    category: 'kolej_room',
    capacity: 1,
    status: 'booked',
    priceMonth: 450,
    priceSemester: 2250,
    depositAmount: 200,
    bedType: 'Single Bed',
    features: ['Central Location'],
  },
  {
    id: 'ktdi-302',
    propertyId: 'ktdi-jb-01',
    propertyName: 'Kolej Tun Dr. Ismail',
    campusId: 'jb',
    roomNo: '302',
    floor: 3,
    block: 'Block M-04',
    roomType: 'Single Room',
    category: 'kolej_room',
    capacity: 1,
    status: 'available',
    priceMonth: 450,
    priceSemester: 2250,
    depositAmount: 200,
    bedType: 'Single Bed',
    features: ['Quiet Wing', 'Study Chair', 'Ceiling Fan'],
  },
  {
    id: 'ktdi-303',
    propertyId: 'ktdi-jb-01',
    propertyName: 'Kolej Tun Dr. Ismail',
    campusId: 'jb',
    roomNo: '303',
    floor: 3,
    block: 'Block M-04',
    roomType: 'Single Room',
    category: 'kolej_room',
    capacity: 1,
    status: 'booked',
    priceMonth: 450,
    priceSemester: 2250,
    depositAmount: 200,
    bedType: 'Single Bed',
    features: ['Garden Facing'],
  },
  {
    id: 'ktdi-201',
    propertyId: 'ktdi-jb-01',
    propertyName: 'Kolej Tun Dr. Ismail',
    campusId: 'jb',
    roomNo: '201',
    floor: 2,
    block: 'Block M-04',
    roomType: 'Single Room',
    category: 'kolej_room',
    capacity: 1,
    status: 'booked',
    priceMonth: 450,
    priceSemester: 2250,
    depositAmount: 200,
    bedType: 'Single Bed',
    features: ['Quick Stairs Access'],
  },
  {
    id: 'ktdi-202',
    propertyId: 'ktdi-jb-01',
    propertyName: 'Kolej Tun Dr. Ismail',
    campusId: 'jb',
    roomNo: '202',
    floor: 2,
    block: 'Block M-04',
    roomType: 'Single Room',
    category: 'kolej_room',
    capacity: 1,
    status: 'booked',
    priceMonth: 450,
    priceSemester: 2250,
    depositAmount: 200,
    bedType: 'Single Bed',
    features: ['Study Desk'],
  },
  {
    id: 'ktdi-101',
    propertyId: 'ktdi-jb-01',
    propertyName: 'Kolej Tun Dr. Ismail',
    campusId: 'jb',
    roomNo: '101',
    floor: 1,
    block: 'Block M-04',
    roomType: 'Single Room',
    category: 'kolej_room',
    capacity: 1,
    status: 'maintenance',
    priceMonth: 450,
    priceSemester: 2250,
    depositAmount: 200,
    bedType: 'Single Bed',
    features: ['Ground Floor Access'],
    notes: 'Under routine electrical inspection',
  },
  {
    id: 'ktdi-102',
    propertyId: 'ktdi-jb-01',
    propertyName: 'Kolej Tun Dr. Ismail',
    campusId: 'jb',
    roomNo: '102',
    floor: 1,
    block: 'Block M-04',
    roomType: 'Single Room',
    category: 'kolej_room',
    capacity: 1,
    status: 'booked',
    priceMonth: 450,
    priceSemester: 2250,
    depositAmount: 200,
    bedType: 'Single Bed',
    features: ['Ground Floor Access'],
  },

  // KSJ (Kolej Siswa Jaya) Rooms (All currently Booked or Held -> Waitlist Open)
  {
    id: 'ksj-601',
    propertyId: 'ksj-kl-02',
    propertyName: 'Kolej Siswa Jaya (KSJ)',
    campusId: 'kl',
    roomNo: '601',
    floor: 6,
    block: 'Block B',
    roomType: 'Shared Twin',
    category: 'kolej_room',
    capacity: 2,
    status: 'booked',
    priceMonth: 300,
    priceSemester: 1500,
    depositAmount: 150,
    bedType: 'Twin Bed',
    features: ['Air Conditioning', 'High Floor', 'City View'],
  },
  {
    id: 'ksj-602',
    propertyId: 'ksj-kl-02',
    propertyName: 'Kolej Siswa Jaya (KSJ)',
    campusId: 'kl',
    roomNo: '602',
    floor: 6,
    block: 'Block B',
    roomType: 'Shared Twin',
    category: 'kolej_room',
    capacity: 2,
    status: 'booked',
    priceMonth: 300,
    priceSemester: 1500,
    depositAmount: 150,
    bedType: 'Twin Bed',
    features: ['Air Conditioning', 'City View'],
  },
  {
    id: 'ksj-501',
    propertyId: 'ksj-kl-02',
    propertyName: 'Kolej Siswa Jaya (KSJ)',
    campusId: 'kl',
    roomNo: '501',
    floor: 5,
    block: 'Block B',
    roomType: 'Shared Twin',
    category: 'kolej_room',
    capacity: 2,
    status: 'booked',
    priceMonth: 300,
    priceSemester: 1500,
    depositAmount: 150,
    bedType: 'Twin Bed',
    features: ['Air Conditioning'],
  },
  {
    id: 'ksj-502',
    propertyId: 'ksj-kl-02',
    propertyName: 'Kolej Siswa Jaya (KSJ)',
    campusId: 'kl',
    roomNo: '502',
    floor: 5,
    block: 'Block B',
    roomType: 'Shared Twin',
    category: 'kolej_room',
    capacity: 2,
    status: 'held',
    heldUntil: 'Waitlist Allocation #1 Offer',
    priceMonth: 300,
    priceSemester: 1500,
    depositAmount: 150,
    bedType: 'Twin Bed',
    features: ['Air Conditioning', 'Ensuite Bath'],
  },
  {
    id: 'ksj-505',
    propertyId: 'ksj-kl-02',
    propertyName: 'Kolej Siswa Jaya (KSJ)',
    campusId: 'kl',
    roomNo: '505',
    floor: 5,
    block: 'Block B',
    roomType: 'Shared Twin',
    category: 'kolej_room',
    capacity: 2,
    status: 'booked',
    priceMonth: 300,
    priceSemester: 1500,
    depositAmount: 150,
    bedType: 'Twin Bed',
    features: ['Air Conditioning', 'Double Study Desk'],
  },
  {
    id: 'ksj-401',
    propertyId: 'ksj-kl-02',
    propertyName: 'Kolej Siswa Jaya (KSJ)',
    campusId: 'kl',
    roomNo: '401',
    floor: 4,
    block: 'Block B',
    roomType: 'Shared Twin',
    category: 'kolej_room',
    capacity: 2,
    status: 'booked',
    priceMonth: 300,
    priceSemester: 1500,
    depositAmount: 150,
    bedType: 'Twin Bed',
    features: ['Air Conditioning'],
  },
  {
    id: 'ksj-402',
    propertyId: 'ksj-kl-02',
    propertyName: 'Kolej Siswa Jaya (KSJ)',
    campusId: 'kl',
    roomNo: '402',
    floor: 4,
    block: 'Block B',
    roomType: 'Shared Twin',
    category: 'kolej_room',
    capacity: 2,
    status: 'booked',
    priceMonth: 300,
    priceSemester: 1500,
    depositAmount: 150,
    bedType: 'Twin Bed',
    features: ['Air Conditioning', 'Near Elevator'],
  },
  {
    id: 'ksj-301',
    propertyId: 'ksj-kl-02',
    propertyName: 'Kolej Siswa Jaya (KSJ)',
    campusId: 'kl',
    roomNo: '301',
    floor: 3,
    block: 'Block B',
    roomType: 'Shared Twin',
    category: 'kolej_room',
    capacity: 2,
    status: 'booked',
    priceMonth: 300,
    priceSemester: 1500,
    depositAmount: 150,
    bedType: 'Twin Bed',
    features: ['Air Conditioning'],
  },
  {
    id: 'ksj-302',
    propertyId: 'ksj-kl-02',
    propertyName: 'Kolej Siswa Jaya (KSJ)',
    campusId: 'kl',
    roomNo: '302',
    floor: 3,
    block: 'Block B',
    roomType: 'Shared Twin',
    category: 'kolej_room',
    capacity: 2,
    status: 'booked',
    priceMonth: 300,
    priceSemester: 1500,
    depositAmount: 150,
    bedType: 'Twin Bed',
    features: ['Air Conditioning'],
  },
  {
    id: 'ksj-201',
    propertyId: 'ksj-kl-02',
    propertyName: 'Kolej Siswa Jaya (KSJ)',
    campusId: 'kl',
    roomNo: '201',
    floor: 2,
    block: 'Block B',
    roomType: 'Shared Twin',
    category: 'kolej_room',
    capacity: 2,
    status: 'booked',
    priceMonth: 300,
    priceSemester: 1500,
    depositAmount: 150,
    bedType: 'Twin Bed',
    features: ['Air Conditioning', 'Low Floor'],
  },

  // Residensi UTM KL (Gurney) - Apartment Units & Studios
  {
    id: 'res-1203-a',
    propertyId: 'res-kl-05',
    propertyName: 'Residensi UTM KL (Gurney)',
    campusId: 'kl',
    roomNo: '12-03-A',
    floor: 12,
    block: 'Tower A',
    unitNo: 'Unit 12-03',
    roomType: 'Master Room in 2BR',
    category: 'apartment_room',
    isMasterRoom: true,
    capacity: 1,
    status: 'available',
    priceMonth: 650,
    priceSemester: 3250,
    depositAmount: 350,
    bedType: 'Double Bed',
    features: [
      'Private Ensuite Bathroom',
      'Inverter Aircon',
      'Skyline View',
      'Shared Kitchen & Living Hall',
      'High-Speed 500Mbps Fiber',
    ],
    notes:
      'Spacious master bedroom in a 2-bedroom luxury residence unit directly opposite UTM KL campus.',
    unitContext: {
      unitNo: 'Unit 12-03',
      totalBedrooms: 2,
      otherRooms: [
        {
          roomNo: '12-03-B',
          label: 'Single Room (Bedroom 2)',
          status: 'booked',
          occupantBrief: '3rd Year MJIIT Engineering Student (Quiet & Tidy)',
        },
      ],
    },
  },
  {
    id: 'res-1203-b',
    propertyId: 'res-kl-05',
    propertyName: 'Residensi UTM KL (Gurney)',
    campusId: 'kl',
    roomNo: '12-03-B',
    floor: 12,
    block: 'Tower A',
    unitNo: 'Unit 12-03',
    roomType: 'Single Room in 2BR',
    category: 'apartment_room',
    isMasterRoom: false,
    capacity: 1,
    status: 'booked',
    priceMonth: 500,
    priceSemester: 2500,
    depositAmount: 250,
    bedType: 'Single Bed',
    features: ['Air Conditioning', 'Shared Bath with Room A', 'Workstation'],
    unitContext: {
      unitNo: 'Unit 12-03',
      totalBedrooms: 2,
      otherRooms: [
        {
          roomNo: '12-03-A',
          label: 'Master Room (Bedroom 1)',
          status: 'available',
        },
      ],
    },
  },
  {
    id: 'res-1208',
    propertyId: 'res-kl-05',
    propertyName: 'Residensi UTM KL (Gurney)',
    campusId: 'kl',
    roomNo: '12-08',
    floor: 12,
    block: 'Tower A',
    unitNo: 'Unit 12-08',
    roomType: 'Studio',
    category: 'studio',
    capacity: 1,
    status: 'available',
    priceMonth: 850,
    priceSemester: 4250,
    depositAmount: 500,
    bedType: 'Double Bed',
    features: [
      'Self-Contained Private Studio',
      'Built-in Kitchenette & Refrigerator',
      'Private Washer/Dryer',
      'Smart TV & Fiber Wi-Fi',
      'Swimming Pool & Gym Access',
    ],
    notes: 'Entire private studio suite with zero shared spaces.',
  },
  {
    id: 'res-1502',
    propertyId: 'res-kl-05',
    propertyName: 'Residensi UTM KL (Gurney)',
    campusId: 'kl',
    roomNo: '15-02',
    floor: 15,
    block: 'Tower A',
    unitNo: 'Unit 15-02',
    roomType: 'Twin Studio',
    category: 'twin_studio',
    capacity: 2,
    status: 'available',
    priceMonth: 900,
    priceSemester: 4500,
    depositAmount: 500,
    bedType: 'Twin Bed',
    features: [
      'Dual Single Beds',
      'Private Studio Bathroom',
      'Balcony with KL Tower View',
      'Pantry & Microwave',
    ],
  },

  // Kolej Rahman Putra (KRP) Rooms
  {
    id: 'krp-301',
    propertyId: 'krp-jb-03',
    propertyName: 'Kolej Rahman Putra (KRP)',
    campusId: 'jb',
    roomNo: '301',
    floor: 3,
    block: 'Block A',
    roomType: 'Deluxe Single with Balcony',
    category: 'kolej_room',
    capacity: 1,
    status: 'available',
    priceMonth: 480,
    priceSemester: 2400,
    depositAmount: 200,
    bedType: 'Single Bed',
    features: ['Private Balcony', 'High Ceiling', 'Sports Field View'],
  },
  {
    id: 'krp-302',
    propertyId: 'krp-jb-03',
    propertyName: 'Kolej Rahman Putra (KRP)',
    campusId: 'jb',
    roomNo: '302',
    floor: 3,
    block: 'Block A',
    roomType: 'Deluxe Single with Balcony',
    category: 'kolej_room',
    capacity: 1,
    status: 'available',
    priceMonth: 480,
    priceSemester: 2400,
    depositAmount: 200,
    bedType: 'Single Bed',
    features: ['Private Balcony', 'Attached Washroom'],
  },
  {
    id: 'krp-201',
    propertyId: 'krp-jb-03',
    propertyName: 'Kolej Rahman Putra (KRP)',
    campusId: 'jb',
    roomNo: '201',
    floor: 2,
    block: 'Block A',
    roomType: 'Deluxe Single with Balcony',
    category: 'kolej_room',
    capacity: 1,
    status: 'available',
    priceMonth: 480,
    priceSemester: 2400,
    depositAmount: 200,
    bedType: 'Single Bed',
    features: ['Campus Wi-Fi', 'Study Desk'],
  },
  {
    id: 'krp-202',
    propertyId: 'krp-jb-03',
    propertyName: 'Kolej Rahman Putra (KRP)',
    campusId: 'jb',
    roomNo: '202',
    floor: 2,
    block: 'Block A',
    roomType: 'Deluxe Single with Balcony',
    category: 'kolej_room',
    capacity: 1,
    status: 'booked',
    priceMonth: 480,
    priceSemester: 2400,
    depositAmount: 200,
    bedType: 'Single Bed',
    features: ['Private Balcony'],
  },
  {
    id: 'krp-101',
    propertyId: 'krp-jb-03',
    propertyName: 'Kolej Rahman Putra (KRP)',
    campusId: 'jb',
    roomNo: '101',
    floor: 1,
    block: 'Block A',
    roomType: 'Deluxe Single with Balcony',
    category: 'kolej_room',
    capacity: 1,
    status: 'available',
    priceMonth: 480,
    priceSemester: 2400,
    depositAmount: 200,
    bedType: 'Single Bed',
    features: ['Ground Floor Access', 'Near Cafeteria'],
  },

  // Pagoh Edu Hub Rooms
  {
    id: 'peh-101',
    propertyId: 'pagoh-06',
    propertyName: 'Pagoh Edu Hub Residential Complex',
    campusId: 'pagoh',
    roomNo: '101',
    floor: 1,
    block: 'Wing 3',
    roomType: 'Single Ensuite Room',
    category: 'kolej_room',
    capacity: 1,
    status: 'available',
    priceMonth: 380,
    priceSemester: 1900,
    depositAmount: 180,
    bedType: 'Single Bed',
    features: ['Ensuite Bathroom', 'Bicycle Rack Access', 'Solar Hot Water'],
  },
  {
    id: 'peh-102',
    propertyId: 'pagoh-06',
    propertyName: 'Pagoh Edu Hub Residential Complex',
    campusId: 'pagoh',
    roomNo: '102',
    floor: 1,
    block: 'Wing 3',
    roomType: 'Single Ensuite Room',
    category: 'kolej_room',
    capacity: 1,
    status: 'available',
    priceMonth: 380,
    priceSemester: 1900,
    depositAmount: 180,
    bedType: 'Single Bed',
    features: ['Ensuite Bathroom', 'Study Desk'],
  },
];

export const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    id: 'bk-2026-001',
    bookingCode: 'UTM-BK-84291',
    propertyId: 'ktdi-jb-01',
    propertyName: 'Kolej Tun Dr. Ismail',
    roomType: 'Single Room',
    campusName: 'Johor Bahru Campus',
    studentName: 'Azraf Mahir',
    studentPhone: '+60123456789',
    studentMatric: 'A24MJ3028',
    bookingPeriod: 'Semester 1 2026/2027 (6 Months)',
    amountMonth: 450,
    amountPaid: 200,
    depositPaid: 200,
    paymentMethod: 'FPX Online Banking (Maybank2u / CIMB / Bank Islam)',
    status: 'confirmed',
    createdAt: '2026-10-24 14:32',
    expiresAt: '2026-10-24 14:47',
  },
];

export const INITIAL_WAITLIST: WaitlistRecord[] = [
  {
    id: 'wl-ksj-001',
    propertyId: 'ksj-kl-02',
    propertyName: 'Kolej Siswa Jaya (KSJ)',
    studentName: 'Azraf Mahir',
    studentMatric: 'A24MJ3028',
    studentPhone: '+60123456789',
    position: 3,
    estimatedWaitDays: 4,
    joinedAt: '2026-10-28 10:15',
    status: 'queued',
  },
  {
    id: 'wl-ksj-002',
    propertyId: 'ksj-kl-02',
    propertyName: 'Kolej Siswa Jaya (KSJ)',
    studentName: 'Tanjim Rahman',
    studentMatric: 'A24MJ3012',
    studentPhone: '+60198765432',
    position: 1,
    estimatedWaitDays: 1,
    joinedAt: '2026-10-26 09:20',
    status: 'offered',
  },
];

export const INITIAL_ROOMMATES: RoommateListing[] = [
  {
    id: 'rm-01',
    studentName: 'Azraf Mahir',
    matricNo: 'A24MJ3028',
    faculty: 'MJIIT (Year 2 Software Eng)',
    targetResidence: 'Kolej Siswa Jaya / Residensi UTM KL',
    lifestyle: ['Non-Smoker', 'Quiet Study', 'Organized', 'Early Riser'],
    budgetRange: 'RM 300 - RM 450/mo',
    description:
      'Looking for a clean and considerate roommate for Semester 1. Focused on project development and coding. Happy to share cooking supplies.',
    postedDate: 'Yesterday',
    contactPhone: '+60123456789',
  },
  {
    id: 'rm-02',
    studentName: 'Yahya Al-Husseini',
    matricNo: 'A23CS1092',
    faculty: 'Faculty of Computing (UTM JB)',
    targetResidence: 'Kolej Tun Dr. Ismail (KTDI)',
    lifestyle: ['Night Owl', 'Gamer / Coder', 'Respectful'],
    budgetRange: 'RM 400 - RM 500/mo',
    description:
      'Looking for someone in KTDI Block M or KRP. Usually working late on artificial intelligence research.',
    postedDate: '3 days ago',
    contactPhone: '+60178823145',
  },
  {
    id: 'rm-03',
    studentName: 'Karim bin Roslan',
    matricNo: 'A24MJ2015',
    faculty: 'MJIIT (Mechanical Precision)',
    targetResidence: 'Residensi UTM KL',
    lifestyle: ['Non-Smoker', 'Fitness Enthusiast', 'Tidy'],
    budgetRange: 'RM 400 - RM 600/mo',
    description:
      'Forming a 2-person group for Residensi UTM KL twin suite. Close to MJIIT labs.',
    postedDate: '5 days ago',
    contactPhone: '+60134459812',
  },
];

export const INITIAL_CARPOOLS: CarpoolListing[] = [
  {
    id: 'cp-01',
    driverName: 'Farhan (KSJ Resident Assistant)',
    route: 'KSJ Setiawangsa ➔ UTM KL / MJIIT Gate',
    departureTime: '8:15 AM (Morning Lectures)',
    days: 'Mon - Thu',
    seatsAvailable: 3,
    farePerTrip: 'RM 2.50 / student (shared fuel)',
    vehicle: 'Perodua Bezza (Silver, VEE 4921)',
  },
  {
    id: 'cp-02',
    driverName: 'Siti Aminah',
    route: 'UTM KL Campus ➔ KSJ Hostel (Evening Return)',
    departureTime: '5:30 PM',
    days: 'Daily Weekdays',
    seatsAvailable: 2,
    farePerTrip: 'RM 2.00 / student',
    vehicle: 'Proton Saga (Grey, WXY 8812)',
  },
  {
    id: 'cp-03',
    driverName: 'Danial Hakeem',
    route: 'UTM JB Skudai ➔ Senai Airport / JB Sentral',
    departureTime: 'Friday 4:00 PM',
    days: 'Every Friday',
    seatsAvailable: 4,
    farePerTrip: 'RM 8.00 / student',
    vehicle: 'Perodua Alza (White, JTK 3201)',
  },
];

export const INITIAL_MESSAGE_THREADS: MessageThread[] = [
  {
    id: 'th-01',
    recipientName: 'UTM Housing Office (HEPA)',
    role: 'Central Accommodation Admin',
    unreadCount: 1,
    lastMessage: 'Your booking deposit of RM 200 for KTDI has been recorded in the central database.',
    lastTime: '10:45 AM',
    messages: [
      {
        id: 'm-1',
        sender: 'system',
        text: 'Automated notification: Application received for Semester 1 2026/2027.',
        time: 'Yesterday 14:32',
      },
      {
        id: 'm-2',
        sender: 'student',
        text: 'Hello, I have submitted my verification for Matric A24MJ3028. Is the room key collection at KTDI office?',
        time: 'Yesterday 14:40',
      },
      {
        id: 'm-3',
        sender: 'officer',
        text: 'Your booking deposit of RM 200 for KTDI has been recorded in the central database. Key collection starts on orientation weekend (Sept 28th).',
        time: '10:45 AM',
      },
    ],
  },
  {
    id: 'th-02',
    recipientName: 'Farhan (KSJ RA)',
    role: 'Resident Assistant - KSJ KL',
    unreadCount: 1,
    lastMessage: 'You are currently #3 in line for the KSJ waitlist. A room may open next Monday.',
    lastTime: '09:12 AM',
    messages: [
      {
        id: 'm-4',
        sender: 'student',
        text: 'Hi Farhan, any update on my waitlist position for Kolej Siswa Jaya?',
        time: 'Yesterday 18:20',
      },
      {
        id: 'm-5',
        sender: 'officer',
        text: 'You are currently #3 in line for the KSJ waitlist. A room may open next Monday as senior students complete industrial training.',
        time: '09:12 AM',
      },
    ],
  },
];

export const INITIAL_POIS: PointOfInterest[] = [
  {
    id: 'poi-1',
    name: 'Kolej Tun Dr. Ismail (KTDI)',
    category: 'college',
    campusId: 'jb',
    x: 35,
    y: 38,
    description: '120 rooms • Single college blocks next to FC',
  },
  {
    id: 'poi-2',
    name: 'Faculty of Computing (FC / FSKSM)',
    category: 'faculty',
    campusId: 'jb',
    x: 42,
    y: 35,
    description: 'UTM Computer Science & Software Eng faculty',
  },
  {
    id: 'poi-3',
    name: 'Kolej Rahman Putra (KRP)',
    category: 'college',
    campusId: 'jb',
    x: 28,
    y: 55,
    description: 'Adjacent to Stadium & Sports Complex',
  },
  {
    id: 'poi-4',
    name: 'UTM Main Gate 1 (Skudai)',
    category: 'gate',
    campusId: 'jb',
    x: 65,
    y: 78,
    description: 'Main campus ceremonial entrance',
  },
  {
    id: 'poi-5',
    name: 'Arked Meranti Bus Interchange',
    category: 'bus_stop',
    campusId: 'jb',
    x: 48,
    y: 50,
    description: 'Campus loop shuttle hub & food court',
  },
  {
    id: 'poi-6',
    name: 'Kolej Siswa Jaya (KSJ)',
    category: 'college',
    campusId: 'kl',
    x: 75,
    y: 25,
    description: 'UTM KL Main Residential College in Setiawangsa',
  },
  {
    id: 'poi-7',
    name: 'MJIIT (Malaysia-Japan Int. Inst. of Tech)',
    category: 'faculty',
    campusId: 'kl',
    x: 40,
    y: 52,
    description: 'Japanese-style engineering labs & classrooms',
  },
  {
    id: 'poi-8',
    name: 'Residensi UTM KL (Gurney)',
    category: 'college',
    campusId: 'kl',
    x: 32,
    y: 42,
    description: 'Direct partner residence across Jalan Keramat',
  },
  {
    id: 'poi-9',
    name: 'UTM KL Main Gate (Jalan Semarak)',
    category: 'gate',
    campusId: 'kl',
    x: 45,
    y: 65,
    description: 'Entrance from Jalan Sultan Yahya Petra',
  },
  {
    id: 'poi-10',
    name: 'KSJ Express Shuttle Bus Pick-Up',
    category: 'bus_stop',
    campusId: 'kl',
    x: 78,
    y: 30,
    description: 'Shuttle departs every 15 min to MJIIT',
  },
  {
    id: 'poi-11',
    name: 'Pagoh Edu Hub Residential Complex',
    category: 'college',
    campusId: 'pagoh',
    x: 50,
    y: 45,
    description: 'Modern student village & sports field',
  },
  {
    id: 'poi-12',
    name: 'UTM Pagoh Academic Complex',
    category: 'faculty',
    campusId: 'pagoh',
    x: 45,
    y: 60,
    description: 'Faculty of Applied Sciences & Tech',
  },
];

// Persistent Local Database Store Manager
const STORAGE_KEY_PREFIX = 'utm_smart_stay_db_v1';

export class LocalDatabase {
  static getProperties(): RoomProperty[] {
    try {
      const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}_properties`);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return INITIAL_PROPERTIES;
  }

  static saveProperties(props: RoomProperty[]): void {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_properties`, JSON.stringify(props));
    } catch (e) {
      console.error(e);
    }
  }

  static getBookings(): BookingRecord[] {
    try {
      const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}_bookings`);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return INITIAL_BOOKINGS;
  }

  static saveBookings(bookings: BookingRecord[]): void {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_bookings`, JSON.stringify(bookings));
    } catch (e) {
      console.error(e);
    }
  }

  static getWaitlist(): WaitlistRecord[] {
    try {
      const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}_waitlist`);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return INITIAL_WAITLIST;
  }

  static saveWaitlist(wl: WaitlistRecord[]): void {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_waitlist`, JSON.stringify(wl));
    } catch (e) {
      console.error(e);
    }
  }

  static getWishlist(): string[] {
    try {
      const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}_wishlist`);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return ['ktdi-jb-01']; // default wishlisted
  }

  static toggleWishlist(propertyId: string): string[] {
    const list = this.getWishlist();
    const index = list.indexOf(propertyId);
    let updated: string[];
    if (index >= 0) {
      updated = list.filter((id) => id !== propertyId);
    } else {
      updated = [...list, propertyId];
    }
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_wishlist`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    return updated;
  }

  static createBooking(
    property: RoomProperty,
    paymentMethod: BookingRecord['paymentMethod']
  ): { success: boolean; booking?: BookingRecord; message: string } {
    const properties = this.getProperties();
    const propIndex = properties.findIndex((p) => p.id === property.id);

    if (propIndex === -1) {
      return { success: false, message: 'Property not found in database.' };
    }

    if (properties[propIndex].availableUnits <= 0) {
      return {
        success: false,
        message: 'No available units remaining! Please join the waitlist instead.',
      };
    }

    // Decrement available units atomically
    properties[propIndex].availableUnits -= 1;
    if (properties[propIndex].availableUnits === 0) {
      properties[propIndex].statusBadge = 'Waitlist Open';
    }
    this.saveProperties(properties);

    // Create booking record with 15-minute hold timer
    const now = new Date();
    const expiry = new Date(now.getTime() + 15 * 60 * 1000);

    const newBooking: BookingRecord = {
      id: `bk-${Date.now()}`,
      bookingCode: `UTM-BK-${Math.floor(10000 + Math.random() * 90000)}`,
      propertyId: property.id,
      propertyName: property.name,
      roomType: property.roomType,
      campusName: property.campusName,
      studentName: CURRENT_STUDENT.fullName,
      studentPhone: CURRENT_STUDENT.phone,
      studentMatric: CURRENT_STUDENT.matricNo,
      bookingPeriod: 'Semester 1 2026/2027 (6 Months)',
      amountMonth: property.priceMonth,
      amountPaid: property.depositAmount,
      depositPaid: property.depositAmount,
      paymentMethod,
      status: 'confirmed',
      createdAt: now.toISOString().replace('T', ' ').substring(0, 16),
      expiresAt: expiry.toISOString().replace('T', ' ').substring(0, 16),
    };

    const bookings = this.getBookings();
    bookings.unshift(newBooking);
    this.saveBookings(bookings);

    return {
      success: true,
      booking: newBooking,
      message: `Booking confirmed! Reservation code: ${newBooking.bookingCode}`,
    };
  }

  static joinWaitlist(property: RoomProperty): { success: boolean; waitlist?: WaitlistRecord; message: string } {
    const currentWaitlist = this.getWaitlist();
    const existing = currentWaitlist.find(
      (w) => w.propertyId === property.id && w.studentMatric === CURRENT_STUDENT.matricNo
    );

    if (existing) {
      return {
        success: false,
        message: `You are already in queue for this college at position #${existing.position}.`,
      };
    }

    const countForProperty = currentWaitlist.filter((w) => w.propertyId === property.id).length;
    const newPosition = countForProperty + 1;

    const newEntry: WaitlistRecord = {
      id: `wl-${Date.now()}`,
      propertyId: property.id,
      propertyName: property.name,
      studentName: CURRENT_STUDENT.fullName,
      studentMatric: CURRENT_STUDENT.matricNo,
      studentPhone: CURRENT_STUDENT.phone,
      position: newPosition,
      estimatedWaitDays: newPosition * 2 + 1,
      joinedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'queued',
    };

    currentWaitlist.push(newEntry);
    this.saveWaitlist(currentWaitlist);

    // Update property waitlist count
    const properties = this.getProperties();
    const propIndex = properties.findIndex((p) => p.id === property.id);
    if (propIndex !== -1) {
      properties[propIndex].waitlistCount = (properties[propIndex].waitlistCount || 0) + 1;
      this.saveProperties(properties);
    }

    return {
      success: true,
      waitlist: newEntry,
      message: `Successfully joined waitlist at position #${newPosition}!`,
    };
  }

  static getRooms(propertyId?: string): RoomItem[] {
    try {
      const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}_rooms`);
      const list: RoomItem[] = data ? JSON.parse(data) : INITIAL_ROOMS;
      if (propertyId) {
        return list.filter((r) => r.propertyId === propertyId);
      }
      return list;
    } catch {
      return INITIAL_ROOMS;
    }
  }

  static saveRooms(rooms: RoomItem[]): void {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_rooms`, JSON.stringify(rooms));
    } catch (e) {
      console.error(e);
    }
  }

  static getRoom(roomId: string): RoomItem | undefined {
    return this.getRooms().find((r) => r.id === roomId);
  }

  static updateRoomStatus(roomId: string, status: RoomItem['status']): void {
    const rooms = this.getRooms();
    const idx = rooms.findIndex((r) => r.id === roomId);
    if (idx !== -1) {
      rooms[idx].status = status;
      this.saveRooms(rooms);

      // Recompute derived availableUnits for the parent property
      const propId = rooms[idx].propertyId;
      const properties = this.getProperties();
      const pIndex = properties.findIndex((p) => p.id === propId);
      if (pIndex !== -1) {
        const remaining = rooms.filter((r) => r.propertyId === propId && r.status === 'available').length;
        properties[pIndex].availableUnits = remaining;
        properties[pIndex].statusBadge = remaining > 0 ? 'Available Now' : 'Waitlist Open';
        this.saveProperties(properties);
      }
    }
  }

  static bookSpecificRoom(
    room: RoomItem,
    paymentMethod: BookingRecord['paymentMethod'],
    bookingPeriod: string = 'Semester 1 2026/2027 (6 Months)'
  ): { success: boolean; booking?: BookingRecord; message: string } {
    const rooms = this.getRooms();
    const roomIndex = rooms.findIndex((r) => r.id === room.id);

    if (roomIndex === -1) {
      return { success: false, message: 'Room not found in central database.' };
    }

    // Double-booking database guard (Addendum 01 Sec. 5)
    if (rooms[roomIndex].status !== 'available') {
      return {
        success: false,
        message: `Room ${room.roomNo} was just taken or held by another student! Please select another room.`,
      };
    }

    // Atomic update
    rooms[roomIndex].status = 'booked';
    this.saveRooms(rooms);

    // Sync property available counts
    const properties = this.getProperties();
    const pIndex = properties.findIndex((p) => p.id === room.propertyId);
    if (pIndex !== -1) {
      const remaining = rooms.filter(
        (r) => r.propertyId === room.propertyId && r.status === 'available'
      ).length;
      properties[pIndex].availableUnits = remaining;
      if (remaining === 0) {
        properties[pIndex].statusBadge = 'Waitlist Open';
      }
      this.saveProperties(properties);
    }

    // 15-minute hold timer
    const now = new Date();
    const expiry = new Date(now.getTime() + 15 * 60 * 1000);

    const newBooking: BookingRecord = {
      id: `bk-${Date.now()}`,
      bookingCode: `UTM-BK-${Math.floor(10000 + Math.random() * 90000)}`,
      propertyId: room.propertyId,
      propertyName: room.propertyName,
      roomId: room.id,
      roomNo: room.roomNo,
      floor: room.floor,
      block: room.block,
      roomType: room.roomType,
      campusName:
        room.campusId === 'jb'
          ? 'Johor Bahru Campus'
          : room.campusId === 'kl'
          ? 'Kuala Lumpur Campus'
          : 'Pagoh Campus',
      studentName: CURRENT_STUDENT.fullName,
      studentPhone: CURRENT_STUDENT.phone,
      studentMatric: CURRENT_STUDENT.matricNo,
      bookingPeriod,
      amountMonth: room.priceMonth,
      amountPaid: room.depositAmount,
      depositPaid: room.depositAmount,
      paymentMethod,
      status: 'confirmed',
      createdAt: now.toISOString().replace('T', ' ').substring(0, 16),
      expiresAt: expiry.toISOString().replace('T', ' ').substring(0, 16),
    };

    const bookings = this.getBookings();
    bookings.unshift(newBooking);
    this.saveBookings(bookings);

    return {
      success: true,
      booking: newBooking,
      message: `Room ${room.roomNo} reserved! Reservation Code: ${newBooking.bookingCode}`,
    };
  }

  static resetDatabase(): void {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}_properties`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}_rooms`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}_bookings`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}_waitlist`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}_wishlist`);
  }
}
