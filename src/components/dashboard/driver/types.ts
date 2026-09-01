export type DriverOperationalStatus = 'online' | 'offline' | 'on_break' | 'emergency';

export type TripStatus =
  | 'IDLE'
  | 'ASSIGNED'
  | 'NAVIGATING_TO_PICKUP'
  | 'AT_PICKUP'
  | 'CHECKING_IN_PICKUP'
  | 'LOADING'
  | 'LOADED'
  | 'IN_TRANSIT'
  | 'AT_DELIVERY'
  | 'UNLOADING'
  | 'DELIVERED_POD_PENDING'
  | 'COMPLETED';

export interface DriverTrip {
  id: string;
  loadNumber: string;
  status: TripStatus;
  cargoType: string;
  weight: string;
  equipment: string;
  temperature?: string;
  origin: {
    facility: string;
    address: string;
    contact: string;
    phone: string;
    dock: string;
    appointmentTime: string;
    instructions: string;
    coordinates: { lat: number; lng: number };
  };
  destination: {
    consignee: string;
    address: string;
    contact: string;
    phone: string;
    dock: string;
    appointmentTime: string;
    instructions: string;
    coordinates: { lat: number; lng: number };
  };
  metrics: {
    totalDistanceMi: number;
    remainingDistanceMi: number;
    estimatedHours: string;
    eta: string;
    payout: number;
    speedMph: number;
    speedLimitMph: number;
    nextManeuver: {
      instruction: string;
      distance: string;
      icon: 'turn-right' | 'turn-left' | 'merge' | 'straight' | 'exit';
    };
  };
  sealNumber?: string;
  podSignature?: string;
  podNotes?: string;
  podPhotoUrl?: string;
}

export interface VehicleHealth {
  truckNumber: string;
  model: string;
  vin: string;
  fuelPercent: number;
  rangeMiles: number;
  odometerMiles: number;
  engineStatus: 'Good' | 'Attention' | 'Critical';
  oilLifePercent: number;
  batteryVoltage: number;
  tirePressurePsi: {
    steerLeft: number;
    steerRight: number;
    driveLeftOuter: number;
    driveLeftInner: number;
    driveRightOuter: number;
    driveRightInner: number;
    status: 'Good' | 'Attention' | 'Critical';
  };
  reeferTempF?: number;
  reeferTargetF?: number;
  defLevelPercent: number;
  brakePadWearPercent: number;
  nextServiceDue: string;
}

export interface DriverProfile {
  id: string;
  name: string;
  photoUrl: string;
  rating: number;
  completedTrips: number;
  totalMiles: number;
  safetyScore: number;
  onTimeRate: number;
  carrierName: string;
  assignedTruck: string;
  documents: {
    id: string;
    name: string;
    type: string;
    expiryDate: string;
    daysRemaining: number;
    status: 'Valid' | 'Expiring Soon' | 'Expired';
    fileUrl: string;
  }[];
}

export interface EarningsData {
  todayAmount: number;
  breakdown: {
    tripEarnings: number;
    distancePay: number;
    onTimeBonus: number;
    fuelSurcharge: number;
    expensesDeduction: number;
    netEarnings: number;
  };
  weeklyChart: {
    day: string;
    amount: number;
    miles: number;
  }[];
  recentSettlements: {
    id: string;
    loadNumber: string;
    date: string;
    amount: number;
    status: 'Paid' | 'Processing';
  }[];
}

export interface DispatchMessage {
  id: string;
  sender: 'driver' | 'dispatcher';
  text: string;
  timestamp: string;
  isQuickAction?: boolean;
}
