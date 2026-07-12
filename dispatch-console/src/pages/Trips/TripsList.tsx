import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import Topbar from '@/components/layout/Topbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import { TripStatusBadge } from '@/components/ui/Badge'
import { tripsApi } from '@/lib/api/trips'
import type { TripStatus } from '@/lib/types'
import { Trash2 } from 'lucide-react'
import clsx from 'clsx'

const STATUS_FILTERS: (TripStatus | 'ALL')[] = ['ALL', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']

export default function TripsList() {
  const [status, setStatus] = useState<TripStatus | 'ALL'>('ALL')
  const queryClient = useQueryClient()

  const trips = useQuery({
    queryKey: ['trips', status],
    queryFn: () => tripsApi.getAll(status === 'ALL' ? undefined : status),
  })

  const remove = useMutation({
    mutationFn: (id: string) => tripsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trips'] }),
  })

  return (
    <div>
      <Topbar
        title="Trips"
        subtitle="Transit dispatch routes and status lifecycle"
        action={<Link to="/trips/new"><Button>New trip</Button></Link>}
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
            {s}
          </button>
        ))}
      </div>

      <div className="p-8 pt-5">
        <Card padded={false}>
          {trips.isLoading && <p className="p-6 text-sm text-slate">Loading trips...</p>}
          {trips.data && trips.data.length === 0 && (
            <EmptyState
              title="No trips scheduled"
              description="Dispatch your first trip by assigning an active vehicle and driver."
              action={<Link to="/trips/new"><Button>New trip</Button></Link>}
            />
          )}

          {trips.data && trips.data.length > 0 && (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-ink-900/10">
                  <th className="eyebrow font-normal px-6 py-3">Route / ID</th>
                  <th className="eyebrow font-normal px-6 py-3">Origin → Destination</th>
                  <th className="eyebrow font-normal px-6 py-3">Vehicle</th>
                  <th className="eyebrow font-normal px-6 py-3">Driver</th>
                  <th className="eyebrow font-normal px-6 py-3">Departure</th>
                  <th className="eyebrow font-normal px-6 py-3">Status</th>
                  <th className="eyebrow font-normal px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-900/5">
                {trips.data.map((t) => (
                  <tr key={t.id} className="hover:bg-ink-900/[0.02]">
                    <td className="px-6 py-3">
                      <Link to={`/trips/${t.id}`} className="font-medium text-ink-900 hover:text-stamp-dark">
                        {t.route_name}
                      </Link>
                      <div className="font-mono text-[10px] text-slate-light">#{t.id.slice(0, 8)}</div>
                    </td>
                    <td className="px-6 py-3 text-ink-900">
                      {t.origin} → {t.destination}
                    </td>
                    <td className="px-6 py-3 font-mono text-xs text-ink-900">
                      {t.vehicle ? (
                        <Link to={`/vehicles/${t.vehicle.id}`} className="hover:underline">
                          {t.vehicle.registration_number}
                        </Link>
                      ) : (
                        'Unassigned'
                      )}
                    </td>
                    <td className="px-6 py-3 text-ink-900">
                      {t.driver ? (
                        <Link to={`/drivers/${t.driver.id}`} className="hover:underline">
                          {t.driver.name}
                        </Link>
                      ) : (
                        'Unassigned'
                      )}
                    </td>
                    <td className="px-6 py-3 font-mono text-xs text-slate">
                      {new Date(t.scheduled_departure).toLocaleString()}
                    </td>
                    <td className="px-6 py-3"><TripStatusBadge status={t.status} /></td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => { if (confirm(`Delete trip route "${t.route_name}"?`)) remove.mutate(t.id) }}
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
