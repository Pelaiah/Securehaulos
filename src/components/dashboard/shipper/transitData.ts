export interface CargoChipItem {
  type: 'cpu' | 'file' | 'heart' | 'utensils';
  name: string;
  weight: string;
}

export interface ShipperInTransitLoad {
  id: string;
  image: string;
  plate: string;
  driver: string;
  driverInitials: string;
  driverRating: string;
  driverLoads: number;
  origin: string;
  destination: string;
  cargo: string;
  weight: string;
  distanceKm: number;
  eta: string;
  progress: number;
  statusText: string;
  price: number;
  suggestedFairFare: number;
  vehicleType: 'truck' | 'van' | 'car';
  speedKmH: number;
  mapPin: {
    top: number;
    left: number;
    originCoords: { top: number; left: number };
    destCoords: { top: number; left: number };
  };
  cargoChips: CargoChipItem[];
}

export const DEFAULT_IN_TRANSIT_LOADS: ShipperInTransitLoad[] = [
  {
    id: 'LD-TR-01',
    image: '/Flat Truck.jfif',
    plate: 'AZT 4521',
    driver: 'Tendai M.',
    driverInitials: 'TM',
    driverRating: '4.9',
    driverLoads: 312,
    origin: 'Harare',
    destination: 'Bulawayo',
    cargo: 'Construction Steel & Machinery',
    weight: '12,500 kg',
    distanceKm: 439,
    eta: '42 min',
    progress: 68,
    statusText: 'En route · 42 min ETA',
    price: 340,
    suggestedFairFare: 365,
    vehicleType: 'truck',
    speedKmH: 84,
    mapPin: {
      top: 48,
      left: 56,
      originCoords: { top: 32, left: 68 },
      destCoords: { top: 72, left: 40 },
    },
    cargoChips: [
      { type: 'cpu', name: 'Electronics', weight: '420kg' },
      { type: 'file', name: 'Documents', weight: '16kg' },
      { type: 'heart', name: 'Medical', weight: '188kg' },
      { type: 'utensils', name: 'Food', weight: '60kg' },
    ],
  },
  {
    id: 'LD-TR-02',
    image: '/Clean & Modern Transport Truck Design.jfif',
    plate: 'ACE 7412',
    driver: 'Sarah W.',
    driverInitials: 'SW',
    driverRating: '4.95',
    driverLoads: 420,
    origin: 'Harare',
    destination: 'Mutare',
    cargo: 'Electronics & Medical Devices',
    weight: '8,420 kg',
    distanceKm: 263,
    eta: '28 min',
    progress: 54,
    statusText: 'On Schedule · 28 min ETA',
    price: 280,
    suggestedFairFare: 310,
    vehicleType: 'truck',
    speedKmH: 78,
    mapPin: {
      top: 38,
      left: 74,
      originCoords: { top: 32, left: 68 },
      destCoords: { top: 48, left: 88 },
    },
    cargoChips: [
      { type: 'cpu', name: 'Processors', weight: '1.2t' },
      { type: 'file', name: 'Clinical Docs', weight: '8kg' },
      { type: 'heart', name: 'Cooling Meds', weight: '95kg' },
    ],
  },
  {
    id: 'LD-TR-03',
    image: '/Bulkheads separate the main storage section and minimize back-and-forth motion and maximize efficiency_.jfif',
    plate: 'BHK 9184',
    driver: 'James R.',
    driverInitials: 'JR',
    driverRating: '4.85',
    driverLoads: 275,
    origin: 'Gweru',
    destination: 'Masvingo',
    cargo: 'Liquid Chemicals & Bulkhead Fuel',
    weight: '18,000 L',
    distanceKm: 178,
    eta: '1h 15m',
    progress: 38,
    statusText: 'In Transit · 1h 15m ETA',
    price: 410,
    suggestedFairFare: 435,
    vehicleType: 'truck',
    speedKmH: 72,
    mapPin: {
      top: 58,
      left: 64,
      originCoords: { top: 50, left: 54 },
      destCoords: { top: 74, left: 74 },
    },
    cargoChips: [
      { type: 'utensils', name: 'Chemical Bulk', weight: '14,000 L' },
      { type: 'file', name: 'Safety Regs', weight: '5kg' },
      { type: 'cpu', name: 'Telemetry Box', weight: '14kg' },
    ],
  },
  {
    id: 'LD-TR-04',
    image: '/download.jfif',
    plate: 'DLX 3310',
    driver: 'David K.',
    driverInitials: 'DK',
    driverRating: '4.8',
    driverLoads: 198,
    origin: 'Chitungwiza',
    destination: 'Beitbridge',
    cargo: 'Refrigerated Fresh Produce',
    weight: '14,200 kg',
    distanceKm: 580,
    eta: '2h 45m',
    progress: 42,
    statusText: 'En route · 2h 45m ETA',
    price: 520,
    suggestedFairFare: 550,
    vehicleType: 'truck',
    speedKmH: 88,
    mapPin: {
      top: 76,
      left: 62,
      originCoords: { top: 36, left: 70 },
      destCoords: { top: 92, left: 56 },
    },
    cargoChips: [
      { type: 'utensils', name: 'Fresh Fruits', weight: '8.4t' },
      { type: 'heart', name: 'Cold Monitor', weight: '12kg' },
      { type: 'file', name: 'GIT Cert', weight: '2kg' },
    ],
  },
];
