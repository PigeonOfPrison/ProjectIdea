import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Topbar from '@/components/layout/Topbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { tripsApi } from '@/lib/api/trips'
import { vehiclesApi } from '@/lib/api/vehicles'
import { driversApi } from '@/lib/api/drivers'
import { ChevronLeft } from 'lucide-react'

export default function TripForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Select vehicles that are active
  const vehicles = useQuery({
    queryKey: ['vehicles', 'ACTIVE'],
    queryFn: () => vehiclesApi.getAll('ACTIVE'),
  })

  // Select drivers that are available
  const drivers = useQuery({
    queryKey: ['drivers', 'AVAILABLE'],
    queryFn: () => driversApi.getAll('AVAILABLE'),
  })

  const [routeName, setRouteName] = useState('')
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [scheduledDeparture, setScheduledDeparture] = useState('')
  const [scheduledArrival, setScheduledArrival] = useState('')
  const [vehicleId, setVehicleId] = useState('')
  const [driverId, setDriverId] = useState('')
  const [passengers, setPassengers] = useState(0)
  const [notes, setNotes] = useState('')

  const save = useMutation({
    mutationFn: () => {
      const payload = {
        route_name: routeName,
        origin,
        destination,
        scheduled_departure: new Date(scheduledDeparture).toISOString(),
        scheduled_arrival: new Date(scheduledArrival).toISOString(),
        vehicle_id: vehicleId,
        driver_id: driverId,
        passengers: Number(passengers),
        notes,
      }
      return tripsApi.create(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      queryClient.invalidateQueries({ queryKey: ['drivers'] })
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
      navigate('/trips')
    },
  })

  return (
    <div>
      <Topbar
        title="New Dispatch Trip"
        subtitle="Schedule routes and assign personnel"
        action={
          <Link to="/trips" className="text-sm text-slate hover:text-ink-900 inline-flex items-center gap-1">
            <ChevronLeft size={14} /> Back
          </Link>
        }
      />

      <div className="p-8 max-w-2xl">
        <Card>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              save.mutate()
            }}
            className="space-y-4 text-sm"
          >
            <div>
              <label className="eyebrow block mb-1">Route Name</label>
              <input
                required
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
                placeholder="e.g. Bangalore to Mysore Express"
                className="w-full border border-ink-900/15 rounded-sm px-3 py-2 bg-parchment-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="eyebrow block mb-1">Origin</label>
                <input
                  required
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="Starting point"
                  className="w-full border border-ink-900/15 rounded-sm px-3 py-2 bg-parchment-100"
                />
              </div>
              <div>
                <label className="eyebrow block mb-1">Destination</label>
                <input
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Ending point"
                  className="w-full border border-ink-900/15 rounded-sm px-3 py-2 bg-parchment-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="eyebrow block mb-1">Scheduled Departure</label>
                <input
                  type="datetime-local"
                  required
                  value={scheduledDeparture}
                  onChange={(e) => setScheduledDeparture(e.target.value)}
                  className="w-full border border-ink-900/15 rounded-sm px-3 py-2 bg-parchment-100 font-mono"
                />
              </div>
              <div>
                <label className="eyebrow block mb-1">Scheduled Arrival</label>
                <input
                  type="datetime-local"
                  required
                  value={scheduledArrival}
                  onChange={(e) => setScheduledArrival(e.target.value)}
                  className="w-full border border-ink-900/15 rounded-sm px-3 py-2 bg-parchment-100 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="eyebrow block mb-1">Assign Vehicle (Active only)</label>
                <select
                  required
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="w-full border border-ink-900/15 rounded-sm px-3 py-2 bg-parchment-100 font-mono"
                >
                  <option value="">Select active vehicle</option>
                  {vehicles.data?.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.registration_number} — {v.make} {v.model}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="eyebrow block mb-1">Assign Driver (Available only)</label>
                <select
                  required
                  value={driverId}
                  onChange={(e) => setDriverId(e.target.value)}
                  className="w-full border border-ink-900/15 rounded-sm px-3 py-2 bg-parchment-100"
                >
                  <option value="">Select available driver</option>
                  {drivers.data?.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.license_number})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="eyebrow block mb-1">Initial Passengers Count</label>
              <input
                type="number"
                required
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="w-full border border-ink-900/15 rounded-sm px-3 py-2 bg-parchment-100"
              />
            </div>

            <div>
              <label className="eyebrow block mb-1">Dispatch Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Special routes, road status, warnings..."
                rows={3}
                className="w-full border border-ink-900/15 rounded-sm px-3 py-2 bg-parchment-100"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-ink-900/10">
              <Link to="/trips">
                <Button variant="secondary">Cancel</Button>
              </Link>
              <Button type="submit" disabled={save.isPending}>
                Create & Dispatch
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
