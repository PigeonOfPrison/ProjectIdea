import { NavLink } from 'react-router-dom'
import { LayoutGrid, Bus, Users, Route, Wrench, Fuel, BarChart3, Settings } from 'lucide-react'
import clsx from 'clsx'

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/vehicles', label: 'Vehicles', icon: Bus },
  { to: '/drivers', label: 'Drivers', icon: Users },
  { to: '/trips', label: 'Trips', icon: Route },
  { to: '/maintenance', label: 'Maintenance', icon: Wrench },
  { to: '/fuel-logs', label: 'Fuel Logs', icon: Fuel },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  return (
    <aside className="w-60 shrink-0 bg-ink-950 text-parchment-200 flex flex-col">
      <div className="px-5 py-6 border-b border-parchment-100/10">
        <div className="eyebrow text-dispatch-light">Transit Operations</div>
        <div className="font-display text-xl mt-1">Fleet Command</div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2 rounded-sm text-sm font-medium transition-colors',
                isActive
                  ? 'bg-parchment-100/10 text-parchment-100'
                  : 'text-parchment-300/70 hover:bg-parchment-100/5 hover:text-parchment-100',
              )
            }
          >
            <Icon size={16} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-parchment-100/10">
        <div className="eyebrow text-parchment-300/50">Backend</div>
        <div className="mt-2 space-y-1 font-mono text-[11px] text-parchment-300/60">
          <div>FastAPI · transit-api</div>
          <div>SQLite · local storage</div>
        </div>
      </div>
    </aside>
  )
}
