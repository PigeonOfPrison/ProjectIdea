// ---------- Vehicle ----------

export type VehicleType = 'BUS' | 'VAN' | 'TRUCK' | 'CAR'
export type VehicleStatus = 'ACTIVE' | 'IN_MAINTENANCE' | 'RETIRED' | 'OUT_OF_SERVICE'

export interface Vehicle {
  id: string
  registration_number: string
  make: string
  model: string
  year: number
  type: VehicleType
  capacity: number
  status: VehicleStatus
  fuel_type: string
  mileage: number
  created_at: string
  updated_at: string
}

export interface CreateVehicleRequest {
  registration_number: string
  make: string
  model: string
  year: number
  type: VehicleType
  capacity: number
  fuel_type: string
  mileage: number
}

export type UpdateVehicleRequest = Partial<CreateVehicleRequest>

// ---------- Driver ----------

export type DriverStatus = 'AVAILABLE' | 'ON_TRIP' | 'OFF_DUTY' | 'SUSPENDED'

export interface Driver {
  id: string
  name: string
  email: string
  phone: string
  license_number: string
  license_expiry: string
  status: DriverStatus
  created_at: string
  updated_at: string
}

export interface CreateDriverRequest {
  name: string
  email: string
  phone: string
  license_number: string
  license_expiry: string
  status?: DriverStatus
}

export type UpdateDriverRequest = Partial<CreateDriverRequest>

// ---------- Trip ----------

export type TripStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

export interface Trip {
  id: string
  vehicle_id: string
  driver_id: string
  route_name: string
  origin: string
  destination: string
  scheduled_departure: string
  scheduled_arrival: string
  actual_departure: string | null
  actual_arrival: string | null
  status: TripStatus
  passengers: number
  notes: string | null
  created_at: string
  updated_at: string
  vehicle?: Vehicle
  driver?: Driver
}

export interface CreateTripRequest {
  vehicle_id: string
  driver_id: string
  route_name: string
  origin: string
  destination: string
  scheduled_departure: string
  scheduled_arrival: string
  passengers: number
  notes?: string
}

export type UpdateTripRequest = Partial<CreateTripRequest>

// ---------- Maintenance Log ----------

export type MaintenanceType = 'ROUTINE' | 'REPAIR' | 'INSPECTION' | 'EMERGENCY'

export interface MaintenanceLog {
  id: string
  vehicle_id: string
  type: MaintenanceType
  description: string
  cost: number
  odometer_reading: number
  performed_by: string
  performed_at: string
  next_due_at: string | null
  created_at: string
  vehicle?: Vehicle
}

export interface CreateMaintenanceRequest {
  vehicle_id: string
  type: MaintenanceType
  description: string
  cost: number
  odometer_reading: number
  performed_by: string
  performed_at: string
  next_due_at?: string
}

// ---------- Fuel Log ----------

export interface FuelLog {
  id: string
  vehicle_id: string
  liters: number
  cost_per_liter: number
  total_cost: number
  odometer_reading: number
  fuel_station: string
  fueled_at: string
  created_at: string
  vehicle?: Vehicle
}

export interface CreateFuelLogRequest {
  vehicle_id: string
  liters: number
  cost_per_liter: number
  total_cost: number
  odometer_reading: number
  fuel_station: string
  fueled_at: string
}

// ---------- Dashboard ----------

export interface DashboardStats {
  total_vehicles: number
  active_vehicles: number
  in_maintenance_vehicles: number
  total_drivers: number
  available_drivers: number
  on_trip_drivers: number
  total_trips: number
  scheduled_trips: number
  in_progress_trips: number
  completed_trips: number
  cancelled_trips: number
  total_maintenance_cost: number
  total_fuel_cost: number
}
