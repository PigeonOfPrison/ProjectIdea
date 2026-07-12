import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Topbar from '@/components/layout/Topbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { maintenanceApi } from '@/lib/api/maintenance'
import { vehiclesApi } from '@/lib/api/vehicles'
import type { MaintenanceType } from '@/lib/types'
import { ChevronLeft } from 'lucide-react'

export default function MaintenanceForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Select vehicles
  const vehicles = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => vehiclesApi.getAll(),
  })

  const [vehicleId, setVehicleId] = useState('')
  const [type, setType] = useState<MaintenanceType>('ROUTINE')
  const [description, setDescription] = useState('')
  const [cost, setCost] = useState(0)
  const [odometerReading, setOdometerReading] = useState(0)
  const [performedBy, setPerformedBy] = useState('')
  const [performedAt, setPerformedAt] = useState('')
  const [nextDueAt, setNextDueAt] = useState('')

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        vehicle_id: vehicleId,
        type,
        description,
        cost: Number(cost),
        odometer_reading: Number(odometerReading),
        performed_by: performedBy,
        performed_at: new Date(performedAt).toISOString(),
        ...(nextDueAt && { next_due_at: new Date(nextDueAt).toISOString() }),
      }
      
      const log = await maintenanceApi.create(payload)
      
      // Auto transition vehicle status to IN_MAINTENANCE when logging active service
      // as mandated in Section 3.6 of TransitOps rules.
      await vehiclesApi.updateStatus(vehicleId, 'IN_MAINTENANCE')
      
      return log
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] })
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
      navigate('/maintenance')
    },
  })

  return (
    <div>
      <Topbar
        title="Log Vehicle Maintenance"
        subtitle="Log workshop visits and service repairs"
        action={
          <Link to="/maintenance" className="text-sm text-slate hover:text-ink-900 inline-flex items-center gap-1">
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
            <div className="grid grid-cols-2 gap-4">
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
              <div>
                <label className="eyebrow block mb-1">Maintenance Type</label>
                <select
                  required
                  value={type}
                  onChange={(e) => setType(e.target.value as MaintenanceType)}
                  className="w-full border border-ink-900/15 rounded-sm px-3 py-2 bg-parchment-100 font-mono"
                >
                  <option value="ROUTINE">Routine</option>
                  <option value="REPAIR">Repair</option>
                  <option value="INSPECTION">Inspection</option>
                  <option value="EMERGENCY">Emergency</option>
                </select>
              </div>
            </div>

            <div>
              <label className="eyebrow block mb-1">Description / Repair Details</label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What service was performed?"
                rows={3}
                className="w-full border border-ink-900/15 rounded-sm px-3 py-2 bg-parchment-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="eyebrow block mb-1">Odometer Reading (km)</label>
                <input
                  type="number"
                  required
                  value={odometerReading}
                  onChange={(e) => setOdometerReading(Number(e.target.value))}
                  className="w-full border border-ink-900/15 rounded-sm px-3 py-2 bg-parchment-100"
                />
              </div>
              <div>
                <label className="eyebrow block mb-1">Repair Cost (INR)</label>
                <input
                  type="number"
                  required
                  value={cost}
                  onChange={(e) => setCost(Number(e.target.value))}
                  className="w-full border border-ink-900/15 rounded-sm px-3 py-2 bg-parchment-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="eyebrow block mb-1">Performed By (Mechanic/Shop)</label>
                <input
                  required
                  value={performedBy}
                  onChange={(e) => setPerformedBy(e.target.value)}
                  placeholder="e.g. Workshop/Depot"
                  className="w-full border border-ink-900/15 rounded-sm px-3 py-2 bg-parchment-100"
                />
              </div>
              <div>
                <label className="eyebrow block mb-1">Service Date</label>
                <input
                  type="date"
                  required
                  value={performedAt}
                  onChange={(e) => setPerformedAt(e.target.value)}
                  className="w-full border border-ink-900/15 rounded-sm px-3 py-2 bg-parchment-100 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="eyebrow block mb-1">Next Service Due (Optional)</label>
              <input
                type="date"
                value={nextDueAt}
                onChange={(e) => setNextDueAt(e.target.value)}
                className="w-full border border-ink-900/15 rounded-sm px-3 py-2 bg-parchment-100 font-mono"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-ink-900/10">
              <Link to="/maintenance">
                <Button variant="secondary">Cancel</Button>
              </Link>
              <Button type="submit" disabled={save.isPending}>
                Log Service Record
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
