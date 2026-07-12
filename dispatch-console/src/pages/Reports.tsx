import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar as RechartsBar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import Topbar from '@/components/layout/Topbar'
import Card from '@/components/ui/Card'
import { dashboardApi } from '@/lib/api/dashboard'
import { vehiclesApi } from '@/lib/api/vehicles'

const FLEET_COLORS: Record<string, string> = {
  ACTIVE: '#4C8C6B', // green
  IN_MAINTENANCE: '#E3A857', // amber
  OUT_OF_SERVICE: '#C1443C', // red
  RETIRED: '#5C6B7A', // gray
}

function StatBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100)
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="font-mono text-slate">{label}</span>
        <span className="font-mono text-ink-900">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-ink-900/5 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-parchment-100 border border-ink-900/15 rounded-sm px-3 py-2 shadow-md text-xs font-mono">
      {label && <div className="text-slate mb-1">{label}</div>}
      {payload.map((p: any) => (
        <div key={p.dataKey ?? p.name} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color ?? p.payload?.fill }} />
          <span className="text-ink-900">
            {p.name}: ₹{p.value.toLocaleString('en-IN')}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function Reports() {
  const stats = useQuery({ queryKey: ['dashboard', 'stats'], queryFn: dashboardApi.getStats })
  const vehicles = useQuery({ queryKey: ['vehicles'], queryFn: () => vehiclesApi.getAll() })

  const fleetDistribution = useMemo(() => {
    if (!stats.data) return []
    return [
      { label: 'Active', value: stats.data.active_vehicles, color: FLEET_COLORS.ACTIVE },
      { label: 'In Maintenance', value: stats.data.in_maintenance_vehicles, color: FLEET_COLORS.IN_MAINTENANCE },
      { label: 'Out of Service', value: stats.data.total_vehicles - stats.data.active_vehicles - stats.data.in_maintenance_vehicles - (vehicles.data?.filter(v => v.status === 'RETIRED').length ?? 0), color: FLEET_COLORS.OUT_OF_SERVICE },
      { label: 'Retired', value: vehicles.data?.filter(v => v.status === 'RETIRED').length ?? 0, color: FLEET_COLORS.RETIRED },
    ].filter(item => item.value > 0)
  }, [stats.data, vehicles.data])

  const tripStats = stats.data
    ? [
        { label: 'Completed', value: stats.data.completed_trips, color: '#4C8C6B' },
        { label: 'Scheduled', value: stats.data.scheduled_trips, color: '#5C6B7A' },
        { label: 'In Progress', value: stats.data.in_progress_trips, color: '#E3A857' },
        { label: 'Cancelled', value: stats.data.cancelled_trips, color: '#C1443C' },
      ]
    : []

  const costDistribution = [
    { name: 'Fuel', Amount: stats.data?.total_fuel_cost ?? 0, fill: '#14213D' },
    { name: 'Maintenance', Amount: stats.data?.total_maintenance_cost ?? 0, fill: '#E3A857' },
  ]

  const maxTripStat = Math.max(...tripStats.map((r) => r.value), 1)

  return (
    <div>
      <Topbar title="Reports & Analytics" subtitle="Aggregate vehicle and dispatch performance metrics" />

      <div className="p-8 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <div className="eyebrow mb-4">Trips by status</div>
            <div className="space-y-3">
              {tripStats.map((r) => (
                <StatBar key={r.label} label={r.label} value={r.value} max={maxTripStat} color={r.color} />
              ))}
            </div>
          </Card>

          <Card>
            <div className="eyebrow mb-4">Operational costs split</div>
            {stats.isLoading ? (
              <p className="text-sm text-slate py-8 text-center">Loading...</p>
            ) : (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={costDistribution} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} />
                  <YAxis tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono' }} />
                  <Tooltip content={<ChartTooltip />} />
                  <RechartsBar dataKey="Amount" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>

        <div className="grid grid-cols-5 gap-6">
          <Card className="col-span-2">
            <div className="eyebrow mb-2">Fleet status distribution</div>
            {fleetDistribution.length === 0 ? (
              <p className="text-sm text-slate py-8 text-center">No vehicles registered yet.</p>
            ) : (
              <div className="relative">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={fleetDistribution}
                      dataKey="value"
                      nameKey="label"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={2}
                      stroke="none"
                    >
                      {fleetDistribution.map((entry) => (
                        <Cell key={entry.label} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="font-display text-2xl text-ink-900">{stats.data?.total_vehicles ?? 0}</div>
                  <div className="eyebrow">vehicles</div>
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 justify-center">
              {fleetDistribution.map((d) => (
                <div key={d.label} className="flex items-center gap-1.5 text-[11px] font-mono text-slate">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                  {d.label}
                </div>
              ))}
            </div>
          </Card>

          <Card className="col-span-3">
            <div className="eyebrow mb-4">Financial aggregates</div>
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between border-b border-ink-900/5 pb-2">
                <div>
                  <span className="text-sm text-ink-900 font-medium block">Total Fuel Cost</span>
                  <span className="text-xs text-slate">Refueling logs aggregate</span>
                </div>
                <span className="font-mono text-lg text-ink-900">
                  ₹{(stats.data?.total_fuel_cost ?? 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-ink-900/5 pb-2">
                <div>
                  <span className="text-sm text-ink-900 font-medium block">Total Maintenance Cost</span>
                  <span className="text-xs text-slate">Repair and routine service logs</span>
                </div>
                <span className="font-mono text-lg text-ink-900">
                  ₹{(stats.data?.total_maintenance_cost ?? 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-sm text-ink-900 font-semibold block">Total Operational Cost</span>
                  <span className="text-xs text-slate">Fuel + Maintenance</span>
                </div>
                <span className="font-mono text-xl font-semibold text-stamp-dark">
                  ₹{((stats.data?.total_fuel_cost ?? 0) + (stats.data?.total_maintenance_cost ?? 0)).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
