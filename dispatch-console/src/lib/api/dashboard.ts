import { apiClient } from './client'
import type { DashboardStats } from '@/lib/types'
import { USE_MOCKS, delay } from '@/lib/mocks/config'
import { store } from '@/lib/mocks/data'

export const dashboardApi = {
  getStats: (): Promise<DashboardStats> => {
    if (USE_MOCKS) {
      const stats: DashboardStats = {
        total_vehicles: store.vehicles.length,
        active_vehicles: store.vehicles.filter((v) => v.status === 'ACTIVE').length,
        in_maintenance_vehicles: store.vehicles.filter((v) => v.status === 'IN_MAINTENANCE').length,
        total_drivers: store.drivers.length,
        available_drivers: store.drivers.filter((d) => d.status === 'AVAILABLE').length,
        on_trip_drivers: store.drivers.filter((d) => d.status === 'ON_TRIP').length,
        total_trips: store.trips.length,
        scheduled_trips: store.trips.filter((t) => t.status === 'SCHEDULED').length,
        in_progress_trips: store.trips.filter((t) => t.status === 'IN_PROGRESS').length,
        completed_trips: store.trips.filter((t) => t.status === 'COMPLETED').length,
        cancelled_trips: store.trips.filter((t) => t.status === 'CANCELLED').length,
        total_maintenance_cost: store.maintenanceLogs.reduce((sum, m) => sum + m.cost, 0),
        total_fuel_cost: store.fuelLogs.reduce((sum, f) => sum + f.total_cost, 0),
      }
      return delay(stats)
    }
    return apiClient.get<DashboardStats>('/api/dashboard/stats').then((r) => r.data)
  },
}
