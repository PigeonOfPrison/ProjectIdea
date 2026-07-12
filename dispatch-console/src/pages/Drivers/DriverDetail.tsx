import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Topbar from '@/components/layout/Topbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { DriverStatusBadge, TripStatusBadge } from '@/components/ui/Badge'
import { driversApi } from '@/lib/api/drivers'
import { tripsApi } from '@/lib/api/trips'
import { ChevronLeft } from 'lucide-react'

export default function DriverDetail() {
  const { id } = useParams<{ id: string }>()

  const driver = useQuery({
    queryKey: ['drivers', id],
    queryFn: () => driversApi.getById(id!),
    enabled: !!id,
  })

  const trips = useQuery({
    queryKey: ['trips', { driver_id: id }],
    queryFn: () => tripsApi.getAll(undefined, undefined, id!),
    enabled: !!id,
  })

  if (driver.isLoading) return <p className="p-8 text-sm text-slate">Loading driver...</p>
  if (driver.isError || !driver.data)
    return <p className="p-8 text-sm text-stamp-dark">Couldn't load this driver.</p>

  const d = driver.data

  return (
    <div>
      <Topbar
        title={d.name}
        subtitle="Driver profile detail"
        action={
          <div className="flex items-center gap-3">
            <Link to={`/drivers/${id}/edit`}>
              <Button variant="secondary">Edit</Button>
            </Link>
            <Link to="/drivers" className="text-sm text-slate hover:text-ink-900 inline-flex items-center gap-1">
              <ChevronLeft size={14} /> Back
            </Link>
          </div>
        }
      />

      <div className="p-8 grid grid-cols-3 gap-6">
        <Card className="col-span-2">
          <div className="flex items-center justify-between mb-5">
            <DriverStatusBadge status={d.status} />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="eyebrow">Email</span><p className="mt-1 text-ink-900">{d.email}</p></div>
            <div><span className="eyebrow">Phone</span><p className="mt-1 text-ink-900">{d.phone}</p></div>
            <div><span className="eyebrow">License Number</span><p className="mt-1 font-mono text-ink-900">{d.license_number}</p></div>
            <div><span className="eyebrow">License Expiry Date</span><p className="mt-1 font-mono text-ink-900">{d.license_expiry}</p></div>
          </div>
        </Card>

        <Card>
          <div className="eyebrow mb-3">Trip history</div>
          {trips.isLoading && <p className="text-sm text-slate">Loading...</p>}
          {trips.data?.length === 0 && <p className="text-sm text-slate">No trips found.</p>}
          <div className="space-y-3">
            {trips.data?.slice(0, 5).map((t) => (
              <div key={t.id} className="text-sm border-b border-ink-900/5 pb-2 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-ink-900 truncate max-w-[120px]">{t.route_name}</span>
                  <TripStatusBadge status={t.status} />
                </div>
                <div className="text-[11px] text-slate mt-1">
                  {new Date(t.scheduled_departure).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
