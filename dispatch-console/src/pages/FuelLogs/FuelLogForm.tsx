import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Topbar from '@/components/layout/Topbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { fuelApi } from '@/lib/api/fuel'
import { vehiclesApi } from '@/lib/api/vehicles'
import { ChevronLeft } from 'lucide-react'

export default function FuelLogForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Select vehicles
  const vehicles = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => vehiclesApi.getAll(),
  })

  const [vehicleId, setVehicleId] = useState('')
  const [liters, setLiters] = useState('')
  const [costPerLiter, setCostPerLiter] = useState('')
  const [odometerReading, setOdometerReading] = useState('')
  const [fuelStation, setFuelStation] = useState('')
  const [fueledAt, setFueledAt] = useState('')

  const calculatedTotal =
    liters && costPerLiter ? Number(liters) * Number(costPerLiter) : 0

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        vehicle_id: vehicleId,
        liters: Number(liters),
        cost_per_liter: Number(costPerLiter),
        total_cost: calculatedTotal,
        odometer_reading: Number(odometerReading),
        fuel_station: fuelStation,
        fueled_at: new Date(fueledAt).toISOString(),
      }
      
      const log = await fuelApi.create(payload)
      
      // Auto update vehicle's cumulative mileage in mock or live storage
      await vehiclesApi.update(vehicleId, { mileage: Number(odometerReading) })
      
      return log
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-logs'] })
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
      navigate('/fuel-logs')
    },
  })

  return (
    <div>
      <Topbar
        title="Log Refueling"
        subtitle="Log fuel consumption and purchase amounts"
        action={
          <Link to="/fuel-logs" className="text-sm text-slate hover:text-ink-900 inline-flex items-center gap-1">
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
              <label className="eyebrow block mb-1">Select Vehicle</label>
              <select
                required
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                className="w-full border border-ink-900/15 rounded-sm px-3 py-2 bg-parchment-100 font-mono"
              >
                <option value="">Select vehicle</option>
                {vehicles.data?.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.registration_number} — {v.make} {v.model}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="eyebrow block mb-1">Liters Refueled</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={liters}
                  onChange={(e) => setLiters(e.target.value)}
                  placeholder="e.g. 80.5"
                  className="w-full border border-ink-900/15 rounded-sm px-3 py-2 bg-parchment-100"
                />
              </div>
              <div>
                <label className="eyebrow block mb-1">Cost Per Liter (INR)</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={costPerLiter}
                  onChange={(e) => setCostPerLiter(e.target.value)}
                  placeholder="e.g. 89.50"
                  className="w-full border border-ink-900/15 rounded-sm px-3 py-2 bg-parchment-100"
                />
              </div>
            </div>

            <div>
              <label className="eyebrow block mb-1">Calculated Total Cost</label>
              <div className="w-full border border-ink-900/15 rounded-sm px-3 py-2 bg-ink-900/5 font-mono font-medium">
                ₹{calculatedTotal.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="eyebrow block mb-1">Odometer Reading (km)</label>
                <input
                  type="number"
                  required
                  value={odometerReading}
                  onChange={(e) => setOdometerReading(e.target.value)}
                  className="w-full border border-ink-900/15 rounded-sm px-3 py-2 bg-parchment-100"
                />
              </div>
              <div>
                <label className="eyebrow block mb-1">Fuel Station Location</label>
                <input
                  required
                  value={fuelStation}
                  onChange={(e) => setFuelStation(e.target.value)}
                  placeholder="e.g. Shell - Majestic"
                  className="w-full border border-ink-900/15 rounded-sm px-3 py-2 bg-parchment-100"
                />
              </div>
            </div>

            <div>
              <label className="eyebrow block mb-1">Refuel Date</label>
              <input
                type="date"
                required
                value={fueledAt}
                onChange={(e) => setFueledAt(e.target.value)}
                className="w-full border border-ink-900/15 rounded-sm px-3 py-2 bg-parchment-100 font-mono"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-ink-900/10">
              <Link to="/fuel-logs">
                <Button variant="secondary">Cancel</Button>
              </Link>
              <Button type="submit" disabled={save.isPending}>
                Log Fuel Log
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
