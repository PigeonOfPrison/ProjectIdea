import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import Topbar from '@/components/layout/Topbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import { VehicleStatusBadge, VehicleTypeBadge } from '@/components/ui/Badge'
import { vehiclesApi } from '@/lib/api/vehicles'
import type { VehicleStatus } from '@/lib/types'
import { Trash2 } from 'lucide-react'
import clsx from 'clsx'

const STATUS_FILTERS: (VehicleStatus | 'ALL')[] = ['ALL', 'ACTIVE', 'IN_MAINTENANCE', 'RETIRED', 'OUT_OF_SERVICE']

export default function VehiclesList() {
  const [status, setStatus] = useState<VehicleStatus | 'ALL'>('ALL')
  const queryClient = useQueryClient()

  const vehicles = useQuery({
    queryKey: ['vehicles', status],
    queryFn: () => vehiclesApi.getAll(status === 'ALL' ? undefined : status),
  })

  const remove = useMutation({
    mutationFn: (id: string) => vehiclesApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vehicles'] }),
  })

  return (
    <div>
      <Topbar
        title="Vehicles"
        subtitle="Fleet registry and status tracking"
        action={<Link to="/vehicles/new"><Button>Add vehicle</Button></Link>}
      />

      <div className="px-8 pt-6 flex gap-2">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={clsx(
              'px-3 py-1.5 rounded-full text-xs font-mono border transition-colors',
              status === s
                ? 'bg-ink-900 text-parchment-100 border-ink-900'
                : 'border-ink-900/15 text-slate hover:border-ink-900/30',
            )}
          >
            {s.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      <div className="p-8 pt-5">
        <Card padded={false}>
          {vehicles.isLoading && <p className="p-6 text-sm text-slate">Loading vehicles...</p>}
          {vehicles.data && vehicles.data.length === 0 && (
            <EmptyState
              title="No vehicles yet"
              description="Add your first vehicle to start managing your fleet."
              action={<Link to="/vehicles/new"><Button>Add vehicle</Button></Link>}
            />
          )}

          {vehicles.data && vehicles.data.length > 0 && (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-ink-900/10">
                  <th className="eyebrow font-normal px-6 py-3">Registration</th>
                  <th className="eyebrow font-normal px-6 py-3">Vehicle</th>
                  <th className="eyebrow font-normal px-6 py-3">Type</th>
                  <th className="eyebrow font-normal px-6 py-3">Status</th>
                  <th className="eyebrow font-normal px-6 py-3">Mileage</th>
                  <th className="eyebrow font-normal px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-900/5">
                {vehicles.data.map((v) => (
                  <tr key={v.id} className="hover:bg-ink-900/[0.02]">
                    <td className="px-6 py-3">
                      <Link to={`/vehicles/${v.id}`} className="font-mono text-xs text-ink-900 hover:text-stamp-dark">
                        {v.registration_number}
                      </Link>
                    </td>
                    <td className="px-6 py-3">{v.make} {v.model} ({v.year})</td>
                    <td className="px-6 py-3"><VehicleTypeBadge type={v.type} /></td>
                    <td className="px-6 py-3"><VehicleStatusBadge status={v.status} /></td>
                    <td className="px-6 py-3 font-mono text-xs text-slate">{v.mileage.toLocaleString('en-IN')} km</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => { if (confirm(`Delete ${v.registration_number}?`)) remove.mutate(v.id) }}
                        className="text-slate hover:text-stamp-dark"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </div>
  )
}
