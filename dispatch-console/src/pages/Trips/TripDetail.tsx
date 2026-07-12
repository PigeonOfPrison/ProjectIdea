import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Topbar from '@/components/layout/Topbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { TripStatusBadge } from '@/components/ui/Badge'
import { tripsApi } from '@/lib/api/trips'
import type { TripStatus } from '@/lib/types'
import { ChevronLeft } from 'lucide-react'

const NEXT_STATUS: Record<TripStatus, TripStatus | null> = {
  SCHEDULED: 'IN_PROGRESS',
  IN_PROGRESS: 'COMPLETED',
  COMPLETED: null,
  CANCELLED: null,
}

export default function TripDetail() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()

  const trip = useQuery({
    queryKey: ['trips', id],
    queryFn: () => tripsApi.getById(id!),
    enabled: !!id,
  })

  const advanceStatus = useMutation({
    mutationFn: (status: TripStatus) => tripsApi.updateStatus(id!, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      queryClient.invalidateQueries({ queryKey: ['drivers'] })
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
    },
  })

  if (trip.isLoading) return <p className="p-8 text-sm text-slate">Loading trip details...</p>
  if (trip.isError || !trip.data)
    return <p className="p-8 text-sm text-stamp-dark">Couldn't load this trip.</p>

  const t = trip.data
  const next = NEXT_STATUS[t.status]

  return (
    <div>
      <Topbar
        title={t.route_name}
        subtitle={`Trip #${t.id.slice(0, 8)}`}
        action={
          <Link to="/trips" className="text-sm text-slate hover:text-ink-900 inline-flex items-center gap-1">
            <ChevronLeft size={14} /> Back to trips
          </Link>
        }
      />

      <div className="p-8 grid grid-cols-3 gap-6">
        <Card className="col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <TripStatusBadge status={t.status} />
            <div className="flex gap-2">
              {next && (
                <Button
                  onClick={() => advanceStatus.mutate(next)}
                  disabled={advanceStatus.isPending}
                >
                  Mark as {next.replace(/_/g, ' ').toLowerCase()}
                </Button>
              )}
              {['SCHEDULED', 'IN_PROGRESS'].includes(t.status) && (
                <Button
                  variant="danger"
                  onClick={() => advanceStatus.mutate('CANCELLED')}
                  disabled={advanceStatus.isPending}
                >
                  Cancel Trip
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm border-t border-ink-900/10 pt-4">
            <div>
              <span className="eyebrow">Origin</span>
              <p className="mt-1 text-ink-900">{t.origin}</p>
            </div>
            <div>
              <span className="eyebrow">Destination</span>
              <p className="mt-1 text-ink-900">{t.destination}</p>
            </div>
            <div>
              <span className="eyebrow">Scheduled Departure</span>
              <p className="mt-1 font-mono text-ink-900">{new Date(t.scheduled_departure).toLocaleString()}</p>
            </div>
            <div>
              <span className="eyebrow">Scheduled Arrival</span>
              <p className="mt-1 font-mono text-ink-900">{new Date(t.scheduled_arrival).toLocaleString()}</p>
            </div>
            {t.actual_departure && (
              <div>
                <span className="eyebrow">Actual Departure</span>
                <p className="mt-1 font-mono text-ink-900">{new Date(t.actual_departure).toLocaleString()}</p>
              </div>
            )}
            {t.actual_arrival && (
              <div>
                <span className="eyebrow">Actual Arrival</span>
                <p className="mt-1 font-mono text-ink-900">{new Date(t.actual_arrival).toLocaleString()}</p>
              </div>
            )}
            <div>
              <span className="eyebrow">Passengers Logged</span>
              <p className="mt-1 text-ink-900">{t.passengers} travelers</p>
            </div>
          </div>

          {t.notes && (
            <div className="border-t border-ink-900/10 pt-4">
              <span className="eyebrow">Notes / Dispatch Instructions</span>
              <p className="mt-1 text-sm text-slate bg-parchment-200 p-3 rounded-sm font-mono">{t.notes}</p>
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <Card>
            <div className="eyebrow mb-3">Vehicle Details</div>
            {t.vehicle ? (
              <div className="text-sm space-y-2">
                <div>
                  <span className="text-xs text-slate block">Registration</span>
                  <Link to={`/vehicles/${t.vehicle.id}`} className="font-mono text-ink-900 hover:underline">
                    {t.vehicle.registration_number}
                  </Link>
                </div>
                <div>
                  <span className="text-xs text-slate block">Model</span>
                  <span className="text-ink-900">{t.vehicle.make} {t.vehicle.model}</span>
                </div>
                <div>
                  <span className="text-xs text-slate block">Type</span>
                  <span className="text-ink-900">{t.vehicle.type}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate">No vehicle assigned.</p>
            )}
          </Card>

          <Card>
            <div className="eyebrow mb-3">Driver Details</div>
            {t.driver ? (
              <div className="text-sm space-y-2">
                <div>
                  <span className="text-xs text-slate block">Name</span>
                  <Link to={`/drivers/${t.driver.id}`} className="font-medium text-ink-900 hover:underline">
                    {t.driver.name}
                  </Link>
                </div>
                <div>
                  <span className="text-xs text-slate block">Phone</span>
                  <span className="text-ink-900 font-mono">{t.driver.phone}</span>
                </div>
                <div>
                  <span className="text-xs text-slate block">License</span>
                  <span className="text-ink-900 font-mono text-xs">{t.driver.license_number}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate">No driver assigned.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
