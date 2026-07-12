import { apiClient } from './client'
import type { MaintenanceLog, CreateMaintenanceRequest, MaintenanceType } from '@/lib/types'
import { USE_MOCKS, delay } from '@/lib/mocks/config'
import { store } from '@/lib/mocks/data'

export const maintenanceApi = {
  getAll: (vehicle_id?: string, type?: MaintenanceType) => {
    if (USE_MOCKS) {
      let filtered = [...store.maintenanceLogs]
      if (vehicle_id) filtered = filtered.filter((m) => m.vehicle_id === vehicle_id)
      if (type) filtered = filtered.filter((m) => m.type === type)
      return delay(filtered)
    }
    return apiClient
      .get<MaintenanceLog[]>('/api/maintenance', {
        params: { ...(vehicle_id && { vehicle_id }), ...(type && { type }) },
      })
      .then((r) => r.data)
  },
  getById: (id: string) =>
    USE_MOCKS
      ? delay(store.maintenanceLogs.find((m) => m.id === id)!)
      : apiClient.get<MaintenanceLog>(`/api/maintenance/${id}`).then((r) => r.data),
  create: (body: CreateMaintenanceRequest) => {
    if (USE_MOCKS) {
      const log: MaintenanceLog = {
        id: `maint-mock-${Date.now()}`,
        created_at: new Date().toISOString(),
        vehicle: store.vehicles.find((v) => v.id === body.vehicle_id),
        vehicle_id: body.vehicle_id,
        type: body.type,
        description: body.description,
        cost: body.cost,
        odometer_reading: body.odometer_reading,
        performed_by: body.performed_by,
        performed_at: body.performed_at,
        next_due_at: body.next_due_at ?? null,
      }
      store.maintenanceLogs.unshift(log)
      return delay(log)
    }
    return apiClient.post<MaintenanceLog>('/api/maintenance', body).then((r) => r.data)
  },
  remove: (id: string) => {
    if (USE_MOCKS) {
      store.maintenanceLogs = store.maintenanceLogs.filter((m) => m.id !== id)
      return delay(undefined)
    }
    return apiClient.delete<void>(`/api/maintenance/${id}`).then((r) => r.data)
  },
}
