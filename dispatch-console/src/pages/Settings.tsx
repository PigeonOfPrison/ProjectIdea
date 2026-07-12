import Topbar from '@/components/layout/Topbar'
import Card from '@/components/ui/Card'
import { USE_MOCKS } from '@/lib/mocks/config'

function EndpointRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-ink-900/5 last:border-0">
      <span className="text-sm text-ink-900">{label}</span>
      <span className="font-mono text-xs text-slate">{value}</span>
    </div>
  )
}

export default function Settings() {
  return (
    <div>
      <Topbar title="Settings" subtitle="Backend connections for TransitOps" />

      <div className="p-8 max-w-xl space-y-6">
        <Card>
          <div className="eyebrow mb-2">Data source</div>
          <div className="flex items-center gap-2 mt-2">
            <span className={`h-2 w-2 rounded-full ${USE_MOCKS ? 'bg-dispatch' : 'bg-signal'}`} />
            <span className="text-sm text-ink-900">
              {USE_MOCKS ? 'Mock data (in-memory, resets on reload)' : 'Live FastAPI backend'}
            </span>
          </div>
          <p className="text-xs text-slate mt-2">
            Set <code className="font-mono">VITE_USE_MOCKS=false</code> in <code className="font-mono">.env</code> and
            restart the dev server to switch to your real FastAPI backend.
          </p>
        </Card>

        <Card>
          <div className="eyebrow mb-2">Connected services</div>
          <p className="text-xs text-slate mb-4">
            Configured via environment variables at build time. Update{' '}
            <code className="font-mono">.env</code> and restart the dev server to change these.
          </p>
          <EndpointRow label="TransitOps API Endpoint" value={import.meta.env.VITE_API_URL ?? 'not set'} />
        </Card>
      </div>
    </div>
  )
}
