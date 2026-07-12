interface TopbarProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export default function Topbar({ title, subtitle, action }: TopbarProps) {
  return (
    <header className="flex items-center justify-between px-8 py-6 border-b border-ink-900/10">
      <div>
        <h1 className="font-display text-2xl text-ink-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate mt-1">{subtitle}</p>}
      </div>
      {action}
    </header>
  )
}
