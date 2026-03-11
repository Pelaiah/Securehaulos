
export type Truck = {
  id: string;
  name: string;
  imageUrl: string;
  licensePlate: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'On-time' | 'Delayed' | 'Idle' | 'Alert' | 'Pending';
  fuelLevel: number;
  idleTime: string;
  loadWeight: number;
  cargoIntegrity: boolean;
  unauthorizedDoorOpening: boolean;
  sensors: {
    door: boolean;
    temperature: boolean;
    gps: boolean;
  },
  documents?: Document[];
};

export const trucks: Truck[] = [
  {
    id: 'TR-001',
    name: 'Alpha Hauler',
    imageUrl: 'https://i.imgur.com/tVrGgid.png',
    licensePlate: 'AFG 4321',
    location: { lat: 34.0522, lng: -118.2437 },
    status: 'Alert',
    fuelLevel: 45,
    idleTime: '0h 15m',
    loadWeight: 18000,
    cargoIntegrity: false,
    unauthorizedDoorOpening: true,
    sensors: { door: true, temperature: false, gps: true },
    documents: [
      { id: 'doc-trk-101', name: 'Goods In Transit Insurance', type: 'Insurance', status: 'Approved', expiryDate: '2025-05-10', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
      { id: 'doc-trk-102', name: 'ZIMRA License', type: 'License', status: 'Approved', expiryDate: '2024-12-31', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    ]
  },
  {
    id: 'TR-002',
    name: 'Beta Freight',
    imageUrl: 'https://i.imgur.com/FImHF98.png',
    licensePlate: 'BHE 8765',
    location: { lat: 40.7128, lng: -74.006 },
    status: 'On-time',
    fuelLevel: 82,
    idleTime: '0h 0m',
    loadWeight: 15500,
    cargoIntegrity: true,
    unauthorizedDoorOpening: false,
    sensors: { door: true, temperature: true, gps: true },
    documents: [
        { id: 'doc-trk-201', name: 'Vehicle Insurance', type: 'Insurance', status: 'Approved', expiryDate: '2025-02-20', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    ]
  },
  {
    id: 'TR-003',
    name: 'Gamma Express',
    imageUrl: 'https://i.imgur.com/WSOJfxZ.png',
    licensePlate: 'CJI 2109',
    location: { lat: 41.8781, lng: -87.6298 },
    status: 'Idle',
    fuelLevel: 60,
    idleTime: '2h 30m',
    loadWeight: 0,
    cargoIntegrity: true,
    unauthorizedDoorOpening: false,
    sensors: { door: false, temperature: false, gps: true },
    documents: []
  },
  {
    id: 'TR-004',
    name: 'Delta Cargo',
    imageUrl: 'https://imgur.com/eljOF7J.png',
    licensePlate: 'DKL 6543',
    location: { lat: 29.7604, lng: -95.3698 },
    status: 'Pending',
    fuelLevel: 75,
    idleTime: '0h 0m',
    loadWeight: 19500,
    cargoIntegrity: true,
    unauthorizedDoorOpening: false,
    sensors: { door: true, temperature: true, gps: true },
    documents: [
      { id: 'doc-trk-401', name: 'Vehicle Registration', type: 'Registration', status: 'Pending', expiryDate: '2024-11-01', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    ]
  },
   {
    id: 'SD-752069247',
    name: 'Echo Runner',
    imageUrl: 'https://i.imgur.com/uFLl3cT.png',
    licensePlate: 'EMN 0987',
    location: { lat: 34.0522, lng: -118.2437 },
    status: 'On-time',
    fuelLevel: 90,
    idleTime: '0h 5m',
    loadWeight: 12000,
    cargoIntegrity: true,
    unauthorizedDoorOpening: false,
    sensors: { door: true, temperature: true, gps: true },
    documents: [
        { id: 'doc-trk-501', name: 'Goods In Transit Insurance', type: 'Insurance', status: 'Approved', expiryDate: '2025-08-15', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
        { id: 'doc-trk-502', name: 'ZIMRA License', type: 'License', status: 'Approved', expiryDate: '2024-12-31', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
        { id: 'doc-trk-503', name: 'Vehicle Insurance', type: 'Insurance', status: 'Approved', expiryDate: '2025-07-30', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    ]
  },
];

export type Load = {
  id: string;
  shipperId: string;
  carrierId?: string | null;
  assignedTruckId?: string | null;
  origin: string;
  destination: string;
  cargo: string;
  equipment: 'Dry Van' | 'Reefer' | 'Flatbed';
  isPremium: boolean;
  shipper: string;
  payout: number;
  status: 'Posted' | 'In Transit' | 'Completed' | 'Pending';
};


export type Carrier = {
    id: string;
    companyName: string;
    verified: boolean;
}


export type Document = {
  id: string;
  name: string;
  type: 'Tax' | 'Registration' | 'Insurance' | 'License' | 'Certification' | 'GIT';
  status: 'Approved' | 'Pending' | 'Rejected' | 'Expired';
  expiryDate?: string;
  uploadDate?: string;
  fileUrl: string;
};

export const documents: Document[] = [
  {
    id: 'doc-101',
    name: 'Corporate Tax Return 2023',
    type: 'Tax',
    status: 'Approved',
    uploadDate: '2024-03-10',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    id: 'doc-102',
    name: 'General Liability Insurance',
    type: 'Insurance',
    status: 'Pending',
    expiryDate: '2025-07-01',
    uploadDate: '2024-06-15',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    id: 'doc-103',
    name: 'Carrier Authority (MC/DOT)',
    type: 'License',
    status: 'Approved',
    uploadDate: '2024-01-20',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    id: 'doc-104',
    name: 'W-9 Form',
    type: 'Tax',
    status: 'Approved',
    uploadDate: '2024-02-15',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    id: 'doc-105',
    name: 'Hazmat Safety Permit',
    type: 'Certification',
    status: 'Rejected',
    uploadDate: '2024-05-20',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    id: 'doc-106',
    name: 'GIT Insurance Certificate',
    type: 'GIT',
    status: 'Expired',
    expiryDate: '2024-06-01',
    uploadDate: '2023-06-01',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
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
    { id: '1', name: 'Harry Johnson', date: 'Wed, 7 March 2023', status: 'Active' as const, earned: '32.25', avatar: 'https://i.pravatar.cc/150?u=harry', truckId: 'TR-001' },
    { id: '2', name: 'Monika Brown', date: 'Wed, 7 March 2023', status: 'Active' as const, earned: '95.63', avatar: 'https://i.pravatar.cc/150?u=monika', truckId: 'SD-752069247' },
    { id: '3', name: 'Alex Williams', date: 'Wed, 7 March 2023', status: 'Completed' as const, earned: '56.45', avatar: 'https://i.pravatar.cc/150?u=alex', truckId: 'TR-002' },
    { id: '4', name: 'Anna Miller', date: 'Thu, 6 March 2023', status: 'Completed' as const, earned: '110.80', avatar: 'https://i.pravatar.cc/150?u=anna', truckId: 'TR-003' },
  ];

export type ShipperLoad = {
  id: string;
  date: string;
  cargo: string;
  invoiceValue: number;
  afterTax: number;
  status: 'Awaiting Payment' | 'Paid' | 'In Transit';
  paidDate?: string;
};


export const shipperLoads: ShipperLoad[] = [
  { id: 'ABIS 00001', date: '2024-04-07', cargo: 'UAB Microsoft', invoiceValue: 1380.77, afterTax: 1247.16, status: 'Awaiting Payment' },
  { id: 'ABIS 00002', date: '2024-04-03', cargo: 'UAB IBM', invoiceValue: 1380.77, afterTax: 1247.16, status: 'Awaiting Payment' },
  { id: 'ABIS 00003', date: '2024-04-02', cargo: 'UAB TravelGuru', invoiceValue: 1380.77, afterTax: 1247.16, status: 'Awaiting Payment' },
  { id: 'ABIS 00004', date: '2024-03-24', cargo: 'UAB Flair Digital', invoiceValue: 1380.77, afterTax: 1247.16, status: 'Paid', paidDate: '2024-03-28' },
  { id: 'ABIS 00005', date: '2024-03-20', cargo: 'UAB Apple Store', invoiceValue: 1380.77, afterTax: 1247.16, status: 'Paid', paidDate: '2024-03-22' },
  { id: 'ABIS 00006', date: '2024-02-20', cargo: 'UAB IBM', invoiceValue: 1380.77, afterTax: 1247.16, status: 'Paid', paidDate: '2024-02-25' },
  { id: 'ABIS 00007', date: '2024-02-14', cargo: 'UAB TravelGuru', invoiceValue: 1380.77, afterTax: 1247.16, status: 'Paid', paidDate: '2024-02-18' },
  { id: 'ABIS 00008', date: '2024-01-15', cargo: 'UAB Microsoft', invoiceValue: 1380.77, afterTax: 1247.16, status: 'In Transit' },
];

export type Driver = {
    id: string;
    name: string;
    avatar: string;
    phone: string;
    truck: string;
    status: 'On-time' | 'Delayed' | 'Alert' | 'Idle';
    documents: Document[];
    onLeave: boolean;
    leaveStartDate?: string;
    leaveEndDate?: string;
};

export const drivers: Driver[] = [
  {
    id: 'DRV-001',
    name: 'Alex Williams',
    avatar: 'https://i.pravatar.cc/150?u=alex',
    phone: '+1 (555) 123-4567',
    truck: 'TR-002',
    status: 'On-time',
    onLeave: false,
    documents: [
        { id: 'doc-drv-101', name: 'Commercial Driver\'s License', type: 'License', status: 'Approved', expiryDate: '2026-08-12', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
        { id: 'doc-drv-102', name: 'Medical Certificate', type: 'Certification', status: 'Approved', expiryDate: '2025-01-20', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
        { id: 'doc-drv-103', name: 'GIT Insurance', type: 'GIT', status: 'Approved', expiryDate: '2025-05-10', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    ]
  },
  {
    id: 'DRV-002',
    name: 'Monika Brown',
    avatar: 'https://i.pravatar.cc/150?u=monika',
    phone: '+1 (555) 987-6543',
    truck: 'TR-004',
    status: 'Delayed',
    onLeave: true,
    leaveStartDate: '2024-07-20',
    leaveEndDate: '2024-08-05',
    documents: [
        { id: 'doc-drv-201', name: 'Commercial Driver\'s License', type: 'License', status: 'Approved', expiryDate: '2027-03-15', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
        { id: 'doc-drv-202', name: 'HAZMAT Endorsement', type: 'Certification', status: 'Pending', expiryDate: '2025-11-01', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    ]
  },
  {
    id: 'DRV-003',
    name: 'Harry Johnson',
    avatar: 'https://i.pravatar.cc/150?u=harry',
    phone: '+1 (555) 345-6789',
    truck: 'TR-001',
    status: 'Alert',
    onLeave: false,
    documents: [
         { id: 'doc-drv-301', name: 'Commercial Driver\'s License', type: 'License', status: 'Expired', expiryDate: '2024-06-01', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    ]
  },
  {
    id: 'DRV-004',
    name: 'Anna Miller',
    avatar: 'https://i.pravatar.cc/150?u=anna',
    phone: '+1 (555) 234-5678',
    truck: 'N/A',
    status: 'Idle',
    onLeave: false,
    documents: [
        { id: 'doc-drv-401', name: 'Commercial Driver\'s License', type: 'License', status: 'Approved', expiryDate: '2025-09-10', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
        { id: 'doc-drv-402', name: 'TWIC Card', type: 'Certification', status: 'Rejected', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    ]
  },
];
