import clsx from 'clsx'

const VEHICLE_STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-signal/15 text-signal-dark',
  IN_MAINTENANCE: 'bg-dispatch/15 text-dispatch-dark',
  RETIRED: 'bg-ink-900/5 text-ink-700',
  OUT_OF_SERVICE: 'bg-stamp/10 text-stamp-dark',
}

const DRIVER_STATUS_STYLES: Record<string, string> = {
  AVAILABLE: 'bg-signal/15 text-signal-dark',
  ON_TRIP: 'bg-dispatch/15 text-dispatch-dark',
  OFF_DUTY: 'bg-ink-900/5 text-ink-700',
  SUSPENDED: 'bg-stamp/10 text-stamp-dark',
}

const TRIP_STATUS_STYLES: Record<string, string> = {
  SCHEDULED: 'bg-slate/10 text-slate-dark',
  IN_PROGRESS: 'bg-dispatch/15 text-dispatch-dark',
  COMPLETED: 'bg-signal/15 text-signal-dark',
  CANCELLED: 'bg-stamp/10 text-stamp-dark',
}

const MAINTENANCE_TYPE_STYLES: Record<string, string> = {
  ROUTINE: 'bg-signal/15 text-signal-dark',
  REPAIR: 'bg-dispatch/15 text-dispatch-dark',
  INSPECTION: 'bg-slate/10 text-slate-dark',
  EMERGENCY: 'bg-stamp/10 text-stamp-dark',
}

export function VehicleStatusBadge({ status }: { status: string }) {
  return (
    <span className={clsx('status-pill', VEHICLE_STATUS_STYLES[status] ?? 'bg-slate/10 text-slate')}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}

export function DriverStatusBadge({ status }: { status: string }) {
  return (
    <span className={clsx('status-pill', DRIVER_STATUS_STYLES[status] ?? 'bg-slate/10 text-slate')}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}

export function TripStatusBadge({ status }: { status: string }) {
  return (
    <span className={clsx('status-pill', TRIP_STATUS_STYLES[status] ?? 'bg-slate/10 text-slate')}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}

export function MaintenanceTypeBadge({ type }: { type: string }) {
  return (
    <span className={clsx('status-pill', MAINTENANCE_TYPE_STYLES[type] ?? 'bg-slate/10 text-slate')}>
      {type}
    </span>
  )
}

export function VehicleTypeBadge({ type }: { type: string }) {
  return (
    <span className="status-pill bg-ink-900/5 text-ink-700">
      {type}
    </span>
  )
}
