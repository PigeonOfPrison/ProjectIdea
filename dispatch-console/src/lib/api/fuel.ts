import { apiClient } from './client'
import type { FuelLog, CreateFuelLogRequest } from '@/lib/types'
import { USE_MOCKS, delay } from '@/lib/mocks/config'
import { store } from '@/lib/mocks/data'

export const fuelApi = {
  getAll: (vehicle_id?: string) => {
    if (USE_MOCKS) {
      const filtered = vehicle_id
        ? store.fuelLogs.filter((f) => f.vehicle_id === vehicle_id)
        : [...store.fuelLogs]
      return delay(filtered)
    }
    return apiClient
      .get<FuelLog[]>('/api/fuel-logs', { params: vehicle_id ? { vehicle_id } : {} })
      .then((r) => r.data)
  },
  getById: (id: string) =>
    USE_MOCKS
      ? delay(store.fuelLogs.find((f) => f.id === id)!)
      : apiClient.get<FuelLog>(`/api/fuel-logs/${id}`).then((r) => r.data),
  create: (body: CreateFuelLogRequest) => {
    if (USE_MOCKS) {
      const log: FuelLog = {
        id: `fuel-mock-${Date.now()}`,
        created_at: new Date().toISOString(),
        vehicle: store.vehicles.find((v) => v.id === body.vehicle_id),
        ...body,
      }
      store.fuelLogs.unshift(log)
      return delay(log)
    }
    return apiClient.post<FuelLog>('/api/fuel-logs', body).then((r) => r.data)
  },
  remove: (id: string) => {
    if (USE_MOCKS) {
      store.fuelLogs = store.fuelLogs.filter((f) => f.id !== id)
      return delay(undefined)
    }
    return apiClient.delete<void>(`/api/fuel-logs/${id}`).then((r) => r.data)
  },
}
