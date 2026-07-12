import { apiClient } from './client'
import type { Trip, CreateTripRequest, UpdateTripRequest, TripStatus } from '@/lib/types'
import { USE_MOCKS, delay } from '@/lib/mocks/config'
import { store } from '@/lib/mocks/data'

export const tripsApi = {
  getAll: (status?: TripStatus, vehicle_id?: string, driver_id?: string) => {
    if (USE_MOCKS) {
      let filtered = [...store.trips]
      if (status) filtered = filtered.filter((t) => t.status === status)
      if (vehicle_id) filtered = filtered.filter((t) => t.vehicle_id === vehicle_id)
      if (driver_id) filtered = filtered.filter((t) => t.driver_id === driver_id)
      return delay(filtered)
    }
    return apiClient
      .get<Trip[]>('/api/trips', {
        params: {
          ...(status && { status }),
          ...(vehicle_id && { vehicle_id }),
          ...(driver_id && { driver_id }),
        },
      })
      .then((r) => r.data)
  },
  getById: (id: string) =>
    USE_MOCKS
      ? delay(store.trips.find((t) => t.id === id)!)
      : apiClient.get<Trip>(`/api/trips/${id}`).then((r) => r.data),
  create: (body: CreateTripRequest) => {
    if (USE_MOCKS) {
      const now = new Date().toISOString()
      const trip: Trip = {
        id: `trip-mock-${Date.now()}`,
        status: 'SCHEDULED',
        actual_departure: null,
        actual_arrival: null,
        created_at: now,
        updated_at: now,
        vehicle: store.vehicles.find((v) => v.id === body.vehicle_id),
        driver: store.drivers.find((d) => d.id === body.driver_id),
        vehicle_id: body.vehicle_id,
        driver_id: body.driver_id,
        route_name: body.route_name,
        origin: body.origin,
        destination: body.destination,
        scheduled_departure: body.scheduled_departure,
        scheduled_arrival: body.scheduled_arrival,
        passengers: body.passengers,
        notes: body.notes ?? null,
      }
      store.trips.unshift(trip)
      return delay(trip)
    }
    return apiClient.post<Trip>('/api/trips', body).then((r) => r.data)
  },
  update: (id: string, body: UpdateTripRequest) => {
    if (USE_MOCKS) {
      store.trips = store.trips.map((t) =>
        t.id === id ? { ...t, ...body, updated_at: new Date().toISOString() } : t,
      )
      return delay(store.trips.find((t) => t.id === id)!)
    }
    return apiClient.put<Trip>(`/api/trips/${id}`, body).then((r) => r.data)
  },
  updateStatus: (id: string, status: TripStatus) => {
    if (USE_MOCKS) {
      store.trips = store.trips.map((t) =>
        t.id === id ? { ...t, status, updated_at: new Date().toISOString() } : t,
      )
      return delay(store.trips.find((t) => t.id === id)!)
    }
    return apiClient.patch<Trip>(`/api/trips/${id}/status`, { status }).then((r) => r.data)
  },
  remove: (id: string) => {
    if (USE_MOCKS) {
      store.trips = store.trips.filter((t) => t.id !== id)
      return delay(undefined)
    }
    return apiClient.delete<void>(`/api/trips/${id}`).then((r) => r.data)
  },
}
