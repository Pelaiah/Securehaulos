
export type Truck = {
  id: string;
  name: string;
  imageUrl: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'On-time' | 'Delayed' | 'Idle' | 'Alert';
  fuelLevel: number;
  idleTime: string;
  loadWeight: number;
  cargoIntegrity: boolean;
  unauthorizedDoorOpening: boolean;
};

export const trucks: Truck[] = [
  {
    id: 'TR-001',
    name: 'Alpha Hauler',
    imageUrl: 'https://i.imgur.com/tVrGgid.png',
    location: { lat: 34.0522, lng: -118.2437 },
    status: 'Alert',
    fuelLevel: 45,
    idleTime: '0h 15m',
    loadWeight: 18000,
    cargoIntegrity: false,
    unauthorizedDoorOpening: true,
  },
  {
    id: 'TR-002',
    name: 'Beta Freight',
    imageUrl: 'https://i.imgur.com/FImHF98.png',
    location: { lat: 40.7128, lng: -74.006 },
    status: 'On-time',
    fuelLevel: 82,
    idleTime: '0h 0m',
    loadWeight: 15500,
    cargoIntegrity: true,
    unauthorizedDoorOpening: false,
  },
  {
    id: 'TR-003',
    name: 'Gamma Express',
    imageUrl: 'https://i.imgur.com/WSOJfxZ.png',
    location: { lat: 41.8781, lng: -87.6298 },
    status: 'Idle',
    fuelLevel: 60,
    idleTime: '2h 30m',
    loadWeight: 0,
    cargoIntegrity: true,
    unauthorizedDoorOpening: false,
  },
  {
    id: 'TR-004',
    name: 'Delta Cargo',
    imageUrl: 'https://imgur.com/eljOF7J.png',
    location: { lat: 29.7604, lng: -95.3698 },
    status: 'Delayed',
    fuelLevel: 30,
    idleTime: '1h 5m',
    loadWeight: 20000,
    cargoIntegrity: true,
    unauthorizedDoorOpening: false,
  },
   {
    id: 'SD-752069247',
    name: 'Echo Runner',
    imageUrl: 'https://i.imgur.com/uFLl3cT.png',
    location: { lat: 34.0522, lng: -118.2437 },
    status: 'On-time',
    fuelLevel: 90,
    idleTime: '0h 5m',
    loadWeight: 12000,
    cargoIntegrity: true,
    unauthorizedDoorOpening: false,
  },
];

export type Load = {
  id: string;
  origin: string;
  destination: string;
  cargo: string;
  equipment: 'Dry Van' | 'Reefer' | 'Flatbed';
  isPremium: boolean;
  shipper: string;
  payout: number;
};

export const loads: Load[] = [
  {
    id: 'LD-101',
    origin: 'Los Angeles, CA',
    destination: 'Phoenix, AZ',
    cargo: 'Consumer Electronics',
    equipment: 'Dry Van',
    isPremium: true,
    shipper: 'Global Tech Inc.',
    payout: 2500,
  },
  {
    id: 'LD-102',
    origin: 'New York, NY',
    destination: 'Boston, MA',
    cargo: 'Fresh Produce',
    equipment: 'Reefer',
    isPremium: false,
    shipper: 'East Coast Organics',
    payout: 1800,
  },
  {
    id: 'LD-103',
    origin: 'Chicago, IL',
    destination: 'Detroit, MI',
    cargo: 'Automotive Parts',
    equipment: 'Dry Van',
    isPremium: false,
    shipper: 'Motor City Suppliers',
    payout: 1200,
  },
  {
    id: 'LD-104',
    origin: 'Houston, TX',
    destination: 'Dallas, TX',
    cargo: 'Building Materials',
    equipment: 'Flatbed',
    isPremium: true,
    shipper: 'State Construction Co.',
    payout: 950,
  },
];

export type Document = {
  id: string;
  name: string;
  type: 'Tax' | 'Registration' | 'Insurance';
  status: 'Approved' | 'Pending' | 'Rejected' | 'Expired';
  expiryDate?: string;
};

export const documents: Document[] = [
  {
    id: 'DOC-SH-01',
    name: 'Company Registration',
    type: 'Registration',
    status: 'Approved',
    expiryDate: '2028-11-20',
  },
  {
    id: 'DOC-SH-02',
    name: 'Tax Clearance Certificate',
    type: 'Tax',
    status: 'Pending',
  },
  {
    id: 'DOC-SH-03',
    name: 'General Liability Insurance',
    type: 'Insurance',
    status: 'Approved',
    expiryDate: '2025-06-30',
  },
  {
    id: 'DOC-SH-04',
    name: 'Business License',
    type: 'Registration',
    status: 'Expired',
    expiryDate: '2024-03-15',
  },
];


export const subscriptionPlans = {
  free: {
    name: 'Free Tier',
    price: '$0/month',
    features: [
      'Basic Load Board Access',
      'Standard Document Management',
      'Email Support',
    ],
  },
  premium: {
    name: 'Premium Carrier',
    price: '$49/month',
    features: [
      'All Free Tier features',
      'Priority Ad Placement',
      'Premium Verification Badge',
      'Advanced Analytics Access',
      'Hardware Incentives',
      '24/7 Phone Support',
    ],
  },
};

export const tripData = [
    { id: '1', name: 'Harry Johnson', date: 'Wed, 7 March 2023', status: 'Active', earned: '32.25', avatar: 'https://i.pravatar.cc/150?u=harry' },
    { id: '2', name: 'Monika Brown', date: 'Wed, 7 March 2023', status: 'Active', earned: '95.63', avatar: 'https://i.pravatar.cc/150?u=monika' },
    { id: '3', name: 'Alex Williams', date: 'Wed, 7 March 2023', status: 'Completed', earned: '56.45', avatar: 'https://i.pravatar.cc/150?u=alex' },
    { id: '4', name: 'Anna Miller', date: 'Thu, 6 March 2023', status: 'Completed', earned: '110.80', avatar: 'https://i.pravatar.cc/150?u=anna' },
  ];
