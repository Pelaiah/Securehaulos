export type UserRole = 'Carrier' | 'Driver' | 'Shipper';

export type UserProfile = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: UserRole;
  phone?: string;
  created_at?: string;
};

export type CarrierProfile = {
  id: string;
  company_name: string;
  fleet_size: number;
  verified: boolean;
  company_logo_url?: string;
  company_mantra?: string;
};

export type ShipperProfile = {
  id: string;
  company_name: string;
  address?: string;
};

export type DriverProfile = {
  id: string;
  license_number: string;
  carrier_id?: string;
};

export type TruckStatus = 'Incomplete' | 'On-time' | 'Delayed' | 'Idle' | 'Alert' | 'Pending';

export type TruckType = 'Flatbed' | 'Reefer' | 'Box Truck' | 'Tanker';

export type SupabaseTruck = {
  id: string;
  carrier_id: string;
  name: string;
  truck_type?: TruckType;
  license_plate?: string;
  tonnage?: number;
  color?: string;
  status: TruckStatus;
  fuel_level: number;
  idle_time: string;
  load_weight: number;
  cargo_integrity: boolean;
  unauthorized_door_opening: boolean;
  location: { lat: number; lng: number };
  created_at?: string;
};
