import { apiClient } from './client'
import type { Vehicle, CreateVehicleRequest, UpdateVehicleRequest, VehicleStatus } from '@/lib/types'
import { USE_MOCKS, delay } from '@/lib/mocks/config'
import { store } from '@/lib/mocks/data'

export const vehiclesApi = {
  getAll: (status?: VehicleStatus, type?: string) => {
    if (USE_MOCKS) {
      let filtered = [...store.vehicles]
      if (status) filtered = filtered.filter((v) => v.status === status)
      if (type) filtered = filtered.filter((v) => v.type === type)
      return delay(filtered)
    }
    return apiClient
      .get<Vehicle[]>('/api/vehicles', { params: { ...(status && { status }), ...(type && { type }) } })
      .then((r) => r.data)
  },
  getById: (id: string) =>
    USE_MOCKS
      ? delay(store.vehicles.find((v) => v.id === id)!)
      : apiClient.get<Vehicle>(`/api/vehicles/${id}`).then((r) => r.data),
  create: (body: CreateVehicleRequest) => {
    if (USE_MOCKS) {
      const now = new Date().toISOString()
      const vehicle: Vehicle = {
        id: `vehicle-mock-${Date.now()}`,
        status: 'ACTIVE',
        created_at: now,
        updated_at: now,
        ...body,
      }
      store.vehicles.unshift(vehicle)
      return delay(vehicle)
    }
    return apiClient.post<Vehicle>('/api/vehicles', body).then((r) => r.data)
  },
  update: (id: string, body: UpdateVehicleRequest) => {
    if (USE_MOCKS) {
      store.vehicles = store.vehicles.map((v) =>
        v.id === id ? { ...v, ...body, updated_at: new Date().toISOString() } : v,
      )
      return delay(store.vehicles.find((v) => v.id === id)!)
    }
    return apiClient.put<Vehicle>(`/api/vehicles/${id}`, body).then((r) => r.data)
  },
  updateStatus: (id: string, status: VehicleStatus) => {
    if (USE_MOCKS) {
      store.vehicles = store.vehicles.map((v) =>
        v.id === id ? { ...v, status, updated_at: new Date().toISOString() } : v,
      )
      return delay(store.vehicles.find((v) => v.id === id)!)
    }
    return apiClient.patch<Vehicle>(`/api/vehicles/${id}/status`, { status }).then((r) => r.data)
  },
  remove: (id: string) => {
    if (USE_MOCKS) {
      store.vehicles = store.vehicles.filter((v) => v.id !== id)
      return delay(undefined)
    }
    return apiClient.delete<void>(`/api/vehicles/${id}`).then((r) => r.data)
  },
}
