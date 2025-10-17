export type Truck = {
  id: string;
  name: string;
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
    location: { lat: 29.7604, lng: -95.3698 },
    status: 'Delayed',
    fuelLevel: 30,
    idleTime: '1h 5m',
    loadWeight: 20000,
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
  type: 'ID' | 'Insurance' | 'Registration';
  status: 'Approved' | 'Pending' | 'Rejected' | 'Expired';
  expiryDate?: string;
};

export const documents: Document[] = [
  {
    id: 'DOC-01',
    name: 'Commercial Driver License',
    type: 'ID',
    status: 'Approved',
    expiryDate: '2026-10-15',
  },
  {
    id: 'DOC-02',
    name: 'Liability Insurance',
    type: 'Insurance',
    status: 'Approved',
    expiryDate: '2025-01-20',
  },
  {
    id: 'DOC-03',
    name: 'Vehicle Registration - TR-001',
    type: 'Registration',
    status: 'Pending',
  },
  {
    id: 'DOC-04',
    name: 'Cargo Insurance',
    type: 'Insurance',
    status: 'Expired',
    expiryDate: '2024-05-30',
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
