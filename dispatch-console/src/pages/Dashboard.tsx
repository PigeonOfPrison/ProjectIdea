import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import Topbar from '@/components/layout/Topbar'
import Card from '@/components/ui/Card'
import { TripStatusBadge } from '@/components/ui/Badge'
import { dashboardApi } from '@/lib/api/dashboard'
import { tripsApi } from '@/lib/api/trips'
import { ArrowUpRight, Bus, Users, Route, AlertTriangle } from 'lucide-react'

function StatTile({ label, value, accent, icon: Icon }: { label: string; value: string | number; accent?: string; icon?: React.ElementType }) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <div className="eyebrow">{label}</div>
          <div className={`font-display text-3xl mt-2 ${accent ?? 'text-ink-900'}`}>{value}</div>
        </div>
        {Icon && <Icon size={20} className="text-slate-light mt-1" strokeWidth={1.5} />}
      </div>
    </Card>
  )
}

export default function Dashboard() {
  const stats = useQuery({ queryKey: ['dashboard', 'stats'], queryFn: dashboardApi.getStats })
  const recentTrips = useQuery({ queryKey: ['trips'], queryFn: () => tripsApi.getAll() })

  return (
    <div>
      <Topbar title="Dashboard" subtitle="Fleet overview at a glance" />

      <div className="p-8 space-y-8">
        <div className="grid grid-cols-4 gap-4">
          <StatTile
            label="Active vehicles"
            value={stats.isLoading ? '—' : stats.data?.active_vehicles ?? 0}
            icon={Bus}
          />
          <StatTile
            label="Available drivers"
            value={stats.isLoading ? '—' : stats.data?.available_drivers ?? 0}
            icon={Users}
          />
          <StatTile
            label="In-progress trips"
            value={stats.isLoading ? '—' : stats.data?.in_progress_trips ?? 0}
            accent="text-dispatch-dark"
            icon={Route}
          />
          <StatTile
            label="In maintenance"
            value={stats.isLoading ? '—' : stats.data?.in_maintenance_vehicles ?? 0}
            accent="text-stamp-dark"
            icon={AlertTriangle}
          />
        </div>

        <div className="grid grid-cols-3 gap-6">
          <Card className="col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="eyebrow">Recent trips</div>
              <Link
                to="/trips"
                className="text-xs font-medium text-slate hover:text-ink-900 inline-flex items-center gap-1"
              >
                View all <ArrowUpRight size={12} />
              </Link>
            </div>

            {recentTrips.isLoading && <p className="text-sm text-slate">Loading trips...</p>}
            {recentTrips.data && recentTrips.data.length === 0 && (
              <p className="text-sm text-slate">No trips recorded yet.</p>
            )}
            <div className="divide-y divide-ink-900/5">
              {recentTrips.data?.slice(0, 6).map((trip) => (
                <Link to={`/trips/${trip.id}`} key={trip.id} className="flex items-center gap-3 py-2.5 text-sm hover:bg-ink-900/[0.02] -mx-1 px-1 rounded-sm transition-colors">
                  <TripStatusBadge status={trip.status} />
                  <span className="font-mono text-xs text-slate w-36 shrink-0">{trip.route_name}</span>
                  <span className="text-ink-900 truncate">{trip.origin} → {trip.destination}</span>
                  <span className="ml-auto text-xs text-slate shrink-0">
                    {trip.passengers > 0 ? `${trip.passengers} pax` : '—'}
                  </span>
                </Link>
              ))}
            </div>
          </Card>

          <Card>
            <div className="eyebrow mb-4">Fleet summary</div>
            {stats.isLoading && <p className="text-sm text-slate">Loading...</p>}
            {stats.data && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-900">Total vehicles</span>
                  <span className="font-mono text-ink-700">{stats.data.total_vehicles}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-900">Total drivers</span>
                  <span className="font-mono text-ink-700">{stats.data.total_drivers}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-900">Scheduled trips</span>
                  <span className="font-mono text-ink-700">{stats.data.scheduled_trips}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-900">Completed trips</span>
                  <span className="font-mono text-ink-700">{stats.data.completed_trips}</span>
                </div>
                <div className="border-t border-ink-900/10 pt-3 mt-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink-900">Fuel costs</span>
                    <span className="font-mono text-ink-700">
                      ₹{(stats.data.total_fuel_cost ?? 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-ink-900">Maintenance costs</span>
                    <span className="font-mono text-ink-700">
                      ₹{(stats.data.total_maintenance_cost ?? 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <Link
              to="/reports"
              className="text-xs font-medium text-slate hover:text-ink-900 inline-flex items-center gap-1 mt-4"
            >
              View reports <ArrowUpRight size={12} />
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
