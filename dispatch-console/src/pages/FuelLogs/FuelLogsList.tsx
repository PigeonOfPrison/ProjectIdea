import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import Topbar from '@/components/layout/Topbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import { fuelApi } from '@/lib/api/fuel'
import { Trash2 } from 'lucide-react'

export default function FuelLogsList() {
  const queryClient = useQueryClient()

  const logs = useQuery({
    queryKey: ['fuel-logs'],
    queryFn: () => fuelApi.getAll(),
  })

  const remove = useMutation({
    mutationFn: (id: string) => fuelApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fuel-logs'] }),
  })

  return (
    <div>
      <Topbar
        title="Fuel Logs"
        subtitle="Track fuel logs and operational costs"
        action={<Link to="/fuel-logs/new"><Button>Log fueling</Button></Link>}
      />

      <div className="p-8">
        <Card padded={false}>
          {logs.isLoading && <p className="p-6 text-sm text-slate">Loading logs...</p>}
          {logs.data && logs.data.length === 0 && (
            <EmptyState
              title="No fuel logged yet"
              description="Keep track of fuel consumption and fuel efficiency for your fleet."
              action={<Link to="/fuel-logs/new"><Button>Log fueling</Button></Link>}
            />
          )}

          {logs.data && logs.data.length > 0 && (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-ink-900/10">
                  <th className="eyebrow font-normal px-6 py-3">Vehicle</th>
                  <th className="eyebrow font-normal px-6 py-3">Fuel Station</th>
                  <th className="eyebrow font-normal px-6 py-3">Liters</th>
                  <th className="eyebrow font-normal px-6 py-3">Cost per Liter</th>
                  <th className="eyebrow font-normal px-6 py-3">Total Cost</th>
                  <th className="eyebrow font-normal px-6 py-3">Odometer</th>
                  <th className="eyebrow font-normal px-6 py-3">Date</th>
                  <th className="eyebrow font-normal px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-900/5">
                {logs.data.map((l) => (
                  <tr key={l.id} className="hover:bg-ink-900/[0.02]">
                    <td className="px-6 py-3 font-mono text-xs text-ink-900">
                      {l.vehicle ? (
                        <Link to={`/vehicles/${l.vehicle.id}`} className="hover:underline">
                          {l.vehicle.registration_number}
                        </Link>
                      ) : (
                        'Unknown'
                      )}
                    </td>
                    <td className="px-6 py-3 text-ink-900">{l.fuel_station || 'Unspecified'}</td>
                    <td className="px-6 py-3 text-ink-900 font-mono text-xs">{l.liters} L</td>
                    <td className="px-6 py-3 text-ink-900 font-mono text-xs">₹{l.cost_per_liter}/L</td>
                    <td className="px-6 py-3 text-ink-900 font-mono text-xs">₹{l.total_cost.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-3 font-mono text-xs text-slate">{l.odometer_reading.toLocaleString('en-IN')} km</td>
                    <td className="px-6 py-3 font-mono text-xs text-slate">
                      {new Date(l.fueled_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => { if (confirm(`Delete fuel log?`)) remove.mutate(l.id) }}
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
