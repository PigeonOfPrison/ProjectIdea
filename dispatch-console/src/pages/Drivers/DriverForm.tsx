import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Topbar from '@/components/layout/Topbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { driversApi } from '@/lib/api/drivers'
import type { DriverStatus } from '@/lib/types'
import { ChevronLeft } from 'lucide-react'

export default function DriverForm() {
  const { id } = useParams<{ id: string }>()
  const isNew = !id
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const existing = useQuery({
    queryKey: ['drivers', id],
    queryFn: () => driversApi.getById(id!),
    enabled: !isNew,
  })

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [licenseNumber, setLicenseNumber] = useState('')
  const [licenseExpiry, setLicenseExpiry] = useState('')
  const [status, setStatus] = useState<DriverStatus>('AVAILABLE')

  useEffect(() => {
    if (existing.data) {
      setName(existing.data.name)
      setEmail(existing.data.email)
      setPhone(existing.data.phone)
      setLicenseNumber(existing.data.license_number)
      setLicenseExpiry(existing.data.license_expiry)
      setStatus(existing.data.status)
    }
  }, [existing.data])

  const save = useMutation({
    mutationFn: () => {
      const payload = {
        name,
        email,
        phone,
        license_number: licenseNumber,
        license_expiry: licenseExpiry,
        status,
      }
      return isNew ? driversApi.create(payload) : driversApi.update(id!, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] })
      navigate('/drivers')
    },
  })

  return (
    <div>
      <Topbar
        title={isNew ? 'Add Driver' : 'Edit Driver'}
        subtitle="Manage driver profile details"
        action={
          <Link to="/drivers" className="text-sm text-slate hover:text-ink-900 inline-flex items-center gap-1">
            <ChevronLeft size={14} /> Back
          </Link>
        }
      />

      <div className="p-8 max-w-2xl">
        <Card>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              save.mutate()
            }}
            className="space-y-4 text-sm"
          >
            <div>
              <label className="eyebrow block mb-1">Driver Name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Patil"
                className="w-full border border-ink-900/15 rounded-sm px-3 py-2 bg-parchment-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="eyebrow block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh.patil@transitops.in"
                  className="w-full border border-ink-900/15 rounded-sm px-3 py-2 bg-parchment-100"
                />
              </div>
              <div>
                <label className="eyebrow block mb-1">Phone Number</label>
                <input
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91-9876543210"
                  className="w-full border border-ink-900/15 rounded-sm px-3 py-2 bg-parchment-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="eyebrow block mb-1">License Number</label>
                <input
                  required
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  placeholder="e.g. KA0120210012345"
                  className="w-full border border-ink-900/15 rounded-sm px-3 py-2 bg-parchment-100 font-mono"
                />
              </div>
              <div>
                <label className="eyebrow block mb-1">License Expiry Date</label>
                <input
                  type="date"
                  required
                  value={licenseExpiry}
                  onChange={(e) => setLicenseExpiry(e.target.value)}
                  className="w-full border border-ink-900/15 rounded-sm px-3 py-2 bg-parchment-100 font-mono"
                />
              </div>
            </div>

            {!isNew && (
              <div>
                <label className="eyebrow block mb-1">Duty Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as DriverStatus)}
                  className="w-full border border-ink-900/15 rounded-sm px-3 py-2 bg-parchment-100 font-mono"
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="ON_TRIP">On Trip</option>
                  <option value="OFF_DUTY">Off Duty</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-ink-900/10">
              <Link to="/drivers">
                <Button variant="secondary">Cancel</Button>
              </Link>
              <Button type="submit" disabled={save.isPending}>
                {isNew ? 'Create Driver' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
