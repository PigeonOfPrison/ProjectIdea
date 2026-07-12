import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import Topbar from '@/components/layout/Topbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import { DriverStatusBadge } from '@/components/ui/Badge'
import { driversApi } from '@/lib/api/drivers'
import type { DriverStatus } from '@/lib/types'
import { Trash2 } from 'lucide-react'
import clsx from 'clsx'

const STATUS_FILTERS: (DriverStatus | 'ALL')[] = ['ALL', 'AVAILABLE', 'ON_TRIP', 'OFF_DUTY', 'SUSPENDED']

export default function DriversList() {
  const [status, setStatus] = useState<DriverStatus | 'ALL'>('ALL')
  const queryClient = useQueryClient()

  const drivers = useQuery({
    queryKey: ['drivers', status],
    queryFn: () => driversApi.getAll(status === 'ALL' ? undefined : status),
  })

  const remove = useMutation({
    mutationFn: (id: string) => driversApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['drivers'] }),
  })

  return (
    <div>
      <Topbar
        title="Drivers"
        subtitle="Driver directory and duty status"
        action={<Link to="/drivers/new"><Button>Add driver</Button></Link>}
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
          {drivers.isLoading && <p className="p-6 text-sm text-slate">Loading drivers...</p>}
          {drivers.data && drivers.data.length === 0 && (
            <EmptyState
              title="No drivers yet"
              description="Add your first driver profile to start assigning trips."
              action={<Link to="/drivers/new"><Button>Add driver</Button></Link>}
            />
          )}

          {drivers.data && drivers.data.length > 0 && (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-ink-900/10">
                  <th className="eyebrow font-normal px-6 py-3">Name</th>
                  <th className="eyebrow font-normal px-6 py-3">Contact</th>
                  <th className="eyebrow font-normal px-6 py-3">License Number</th>
                  <th className="eyebrow font-normal px-6 py-3">Expiry</th>
                  <th className="eyebrow font-normal px-6 py-3">Status</th>
                  <th className="eyebrow font-normal px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-900/5">
                {drivers.data.map((d) => (
                  <tr key={d.id} className="hover:bg-ink-900/[0.02]">
                    <td className="px-6 py-3">
                      <Link to={`/drivers/${d.id}`} className="font-medium text-ink-900 hover:text-stamp-dark">
                        {d.name}
                      </Link>
                    </td>
                    <td className="px-6 py-3">
                      <div className="text-ink-900">{d.phone}</div>
                      <div className="text-xs text-slate-light">{d.email}</div>
                    </td>
                    <td className="px-6 py-3 font-mono text-xs text-ink-900">{d.license_number}</td>
                    <td className="px-6 py-3 font-mono text-xs text-slate">{d.license_expiry}</td>
                    <td className="px-6 py-3"><DriverStatusBadge status={d.status} /></td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => { if (confirm(`Delete driver "${d.name}"?`)) remove.mutate(d.id) }}
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
