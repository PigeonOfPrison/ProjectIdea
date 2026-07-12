import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import Topbar from '@/components/layout/Topbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import { MaintenanceTypeBadge } from '@/components/ui/Badge'
import { maintenanceApi } from '@/lib/api/maintenance'
import type { MaintenanceType } from '@/lib/types'
import { Trash2 } from 'lucide-react'
import clsx from 'clsx'

const STATUS_FILTERS: (MaintenanceType | 'ALL')[] = ['ALL', 'ROUTINE', 'REPAIR', 'INSPECTION', 'EMERGENCY']

export default function MaintenanceList() {
  const [type, setType] = useState<MaintenanceType | 'ALL'>('ALL')
  const queryClient = useQueryClient()

  const maintenance = useQuery({
    queryKey: ['maintenance', type],
    queryFn: () => maintenanceApi.getAll(undefined, type === 'ALL' ? undefined : type),
  })

  const remove = useMutation({
    mutationFn: (id: string) => maintenanceApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['maintenance'] }),
  })

  return (
    <div>
      <Topbar
        title="Maintenance Log"
        subtitle="Track garage logs and vehicle repairs"
        action={<Link to="/maintenance/new"><Button>Log maintenance</Button></Link>}
      />

      <div className="px-8 pt-6 flex gap-2">
        {STATUS_FILTERS.map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={clsx(
              'px-3 py-1.5 rounded-full text-xs font-mono border transition-colors',
              type === t
                ? 'bg-ink-900 text-parchment-100 border-ink-900'
                : 'border-ink-900/15 text-slate hover:border-ink-900/30',
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="p-8 pt-5">
        <Card padded={false}>
          {maintenance.isLoading && <p className="p-6 text-sm text-slate">Loading logs...</p>}
          {maintenance.data && maintenance.data.length === 0 && (
            <EmptyState
              title="No maintenance logged"
              description="Keep your fleet in shape by recording inspections and routine repairs."
              action={<Link to="/maintenance/new"><Button>Log maintenance</Button></Link>}
            />
          )}

          {maintenance.data && maintenance.data.length > 0 && (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-ink-900/10">
                  <th className="eyebrow font-normal px-6 py-3">Vehicle</th>
                  <th className="eyebrow font-normal px-6 py-3">Type</th>
                  <th className="eyebrow font-normal px-6 py-3">Description</th>
                  <th className="eyebrow font-normal px-6 py-3">Service Provider</th>
                  <th className="eyebrow font-normal px-6 py-3">Cost</th>
                  <th className="eyebrow font-normal px-6 py-3">Date</th>
                  <th className="eyebrow font-normal px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-900/5">
                {maintenance.data.map((m) => (
                  <tr key={m.id} className="hover:bg-ink-900/[0.02]">
                    <td className="px-6 py-3 font-mono text-xs text-ink-900">
                      {m.vehicle ? (
                        <Link to={`/vehicles/${m.vehicle.id}`} className="hover:underline">
                          {m.vehicle.registration_number}
                        </Link>
                      ) : (
                        'Unknown'
                      )}
                    </td>
                    <td className="px-6 py-3"><MaintenanceTypeBadge type={m.type} /></td>
                    <td className="px-6 py-3 text-ink-900 max-w-xs truncate">{m.description}</td>
                    <td className="px-6 py-3 text-ink-900">{m.performed_by}</td>
                    <td className="px-6 py-3 font-mono text-xs text-ink-900">₹{m.cost.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-3 font-mono text-xs text-slate">
                      {new Date(m.performed_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => { if (confirm(`Delete maintenance record?`)) remove.mutate(m.id) }}
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
