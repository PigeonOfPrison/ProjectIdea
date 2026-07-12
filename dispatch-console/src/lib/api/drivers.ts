import { apiClient } from './client'
import type { Driver, CreateDriverRequest, UpdateDriverRequest, DriverStatus } from '@/lib/types'
import { USE_MOCKS, delay } from '@/lib/mocks/config'
import { store } from '@/lib/mocks/data'

export const driversApi = {
  getAll: (status?: DriverStatus) => {
    if (USE_MOCKS) {
      const filtered = status ? store.drivers.filter((d) => d.status === status) : [...store.drivers]
      return delay(filtered)
    }
    return apiClient
      .get<Driver[]>('/api/drivers', { params: status ? { status } : {} })
      .then((r) => r.data)
  },
  getById: (id: string) =>
    USE_MOCKS
      ? delay(store.drivers.find((d) => d.id === id)!)
      : apiClient.get<Driver>(`/api/drivers/${id}`).then((r) => r.data),
  create: (body: CreateDriverRequest) => {
    if (USE_MOCKS) {
      const now = new Date().toISOString()
      const driver: Driver = {
        id: `driver-mock-${Date.now()}`,
        status: body.status ?? 'AVAILABLE',
        created_at: now,
        updated_at: now,
        ...body,
      }
      store.drivers.unshift(driver)
      return delay(driver)
    }
    return apiClient.post<Driver>('/api/drivers', body).then((r) => r.data)
  },
  update: (id: string, body: UpdateDriverRequest) => {
    if (USE_MOCKS) {
      store.drivers = store.drivers.map((d) =>
        d.id === id ? { ...d, ...body, updated_at: new Date().toISOString() } : d,
      )
      return delay(store.drivers.find((d) => d.id === id)!)
    }
    return apiClient.put<Driver>(`/api/drivers/${id}`, body).then((r) => r.data)
  },
  remove: (id: string) => {
    if (USE_MOCKS) {
      store.drivers = store.drivers.filter((d) => d.id !== id)
      return delay(undefined)
    }
    return apiClient.delete<void>(`/api/drivers/${id}`).then((r) => r.data)
  },
}
