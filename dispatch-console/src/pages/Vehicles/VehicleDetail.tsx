import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Topbar from '@/components/layout/Topbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { VehicleStatusBadge, MaintenanceTypeBadge } from '@/components/ui/Badge'
import { vehiclesApi } from '@/lib/api/vehicles'
import { maintenanceApi } from '@/lib/api/maintenance'
import { fuelApi } from '@/lib/api/fuel'
import type { VehicleStatus } from '@/lib/types'
import { ChevronLeft } from 'lucide-react'

const STATUS_OPTIONS: VehicleStatus[] = ['ACTIVE', 'IN_MAINTENANCE', 'RETIRED', 'OUT_OF_SERVICE']

export default function VehicleDetail() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()

  const vehicle = useQuery({
    queryKey: ['vehicles', id],
    queryFn: () => vehiclesApi.getById(id!),
    enabled: !!id,
  })

  const maintenance = useQuery({
    queryKey: ['maintenance', { vehicle_id: id }],
    queryFn: () => maintenanceApi.getAll(id!),
    enabled: !!id,
  })

  const fuelLogs = useQuery({
    queryKey: ['fuel-logs', { vehicle_id: id }],
    queryFn: () => fuelApi.getAll(id!),
    enabled: !!id,
  })

  const updateStatus = useMutation({
    mutationFn: (status: VehicleStatus) => vehiclesApi.updateStatus(id!, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vehicles'] }),
  })

  if (vehicle.isLoading) return <p className="p-8 text-sm text-slate">Loading vehicle...</p>
  if (vehicle.isError || !vehicle.data)
    return <p className="p-8 text-sm text-stamp-dark">Couldn't load this vehicle.</p>

  const v = vehicle.data

  return (
    <div>
      <Topbar
        title={v.registration_number}
        subtitle={`${v.make} ${v.model} (${v.year})`}
        action={
          <div className="flex items-center gap-3">
            <Link to={`/vehicles/${id}/edit`}>
              <Button variant="secondary">Edit</Button>
            </Link>
            <Link to="/vehicles" className="text-sm text-slate hover:text-ink-900 inline-flex items-center gap-1">
              <ChevronLeft size={14} /> Back
            </Link>
          </div>
        }
      />

      <div className="p-8 grid grid-cols-3 gap-6">
        <Card className="col-span-2">
          <div className="flex items-center justify-between mb-5">
            <VehicleStatusBadge status={v.status} />
            <div className="flex gap-2">
              {STATUS_OPTIONS.filter((s) => s !== v.status).map((s) => (
                <Button
                  key={s}
                  variant="secondary"
                  onClick={() => updateStatus.mutate(s)}
                  disabled={updateStatus.isPending}
                >
                  Set {s.replace(/_/g, ' ').toLowerCase()}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="eyebrow">Type</span><p className="mt-1 text-ink-900">{v.type}</p></div>
            <div><span className="eyebrow">Capacity</span><p className="mt-1 text-ink-900">{v.capacity} seats</p></div>
            <div><span className="eyebrow">Fuel Type</span><p className="mt-1 text-ink-900">{v.fuel_type}</p></div>
            <div><span className="eyebrow">Mileage</span><p className="mt-1 font-mono text-ink-900">{v.mileage.toLocaleString('en-IN')} km</p></div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <div className="eyebrow mb-3">Recent maintenance</div>
            {maintenance.isLoading && <p className="text-sm text-slate">Loading...</p>}
            {maintenance.data?.length === 0 && <p className="text-sm text-slate">No records.</p>}
            <div className="space-y-3">
              {maintenance.data?.slice(0, 4).map((m) => (
                <div key={m.id} className="text-sm">
                  <div className="flex items-center gap-2">
                    <MaintenanceTypeBadge type={m.type} />
                    <span className="font-mono text-xs text-slate">₹{m.cost.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-ink-900 mt-1 truncate">{m.description}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="eyebrow mb-3">Recent fuel logs</div>
            {fuelLogs.isLoading && <p className="text-sm text-slate">Loading...</p>}
            {fuelLogs.data?.length === 0 && <p className="text-sm text-slate">No records.</p>}
            <div className="space-y-3">
              {fuelLogs.data?.slice(0, 4).map((f) => (
                <div key={f.id} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-ink-900">{f.liters}L</span>
                    <span className="text-slate ml-2">@ ₹{f.cost_per_liter}/L</span>
                  </div>
                  <span className="font-mono text-xs text-ink-700">₹{f.total_cost.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
