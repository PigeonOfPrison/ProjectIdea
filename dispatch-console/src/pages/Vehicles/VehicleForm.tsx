import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Topbar from '@/components/layout/Topbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { vehiclesApi } from '@/lib/api/vehicles'
import type { VehicleType } from '@/lib/types'
import { ChevronLeft } from 'lucide-react'

export default function VehicleForm() {
  const { id } = useParams<{ id: string }>()
  const isNew = !id
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const existing = useQuery({
    queryKey: ['vehicles', id],
    queryFn: () => vehiclesApi.getById(id!),
    enabled: !isNew,
  })

  const [regNum, setRegNum] = useState('')
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState(new Date().getFullYear())
  const [type, setType] = useState<VehicleType>('BUS')
  const [capacity, setCapacity] = useState(0)
  const [fuelType, setFuelType] = useState('DIESEL')
  const [mileage, setMileage] = useState(0)

  useEffect(() => {
    if (existing.data) {
      setRegNum(existing.data.registration_number)
      setMake(existing.data.make)
      setModel(existing.data.model)
      setYear(existing.data.year)
      setType(existing.data.type)
      setCapacity(existing.data.capacity)
      setFuelType(existing.data.fuel_type)
      setMileage(existing.data.mileage)
    }
  }, [existing.data])

  const save = useMutation({
    mutationFn: () => {
      const payload = {
        registration_number: regNum,
        make,
        model,
        year: Number(year),
        type,
        capacity: Number(capacity),
        fuel_type: fuelType,
        mileage: Number(mileage),
      }
      return isNew ? vehiclesApi.create(payload) : vehiclesApi.update(id!, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
      navigate('/vehicles')
    },
  })

  return (
    <div>
      <Topbar
        title={isNew ? 'Add Vehicle' : 'Edit Vehicle'}
        subtitle="Manage fleet information details"
        action={
          <Link to="/vehicles" className="text-sm text-slate hover:text-ink-900 inline-flex items-center gap-1">
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
              <label className="eyebrow block mb-1">Registration Number</label>
              <input
                required
                value={regNum}
                onChange={(e) => setRegNum(e.target.value)}
                placeholder="e.g. KA-01-AB-1234"
                className="w-full border border-ink-900/15 rounded-sm px-3 py-2 bg-parchment-100 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="eyebrow block mb-1">Make</label>
                <input
                  required
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  placeholder="e.g. Tata"
                  className="w-full border border-ink-900/15 rounded-sm px-3 py-2 bg-parchment-100"
                />
              </div>
              <div>
                <label className="eyebrow block mb-1">Model</label>
                <input
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. Starbus"
                  className="w-full border border-ink-900/15 rounded-sm px-3 py-2 bg-parchment-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="eyebrow block mb-1">Year</label>
                <input
                  type="number"
                  required
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full border border-ink-900/15 rounded-sm px-3 py-2 bg-parchment-100"
                />
              </div>
              <div>
                <label className="eyebrow block mb-1">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as VehicleType)}
                  className="w-full border border-ink-900/15 rounded-sm px-3 py-2 bg-parchment-100"
                >
                  <option value="BUS">Bus</option>
                  <option value="VAN">Van</option>
                  <option value="TRUCK">Truck</option>
                  <option value="CAR">Car</option>
                </select>
              </div>
              <div>
                <label className="eyebrow block mb-1">Capacity (Seats)</label>
                <input
                  type="number"
                  required
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full border border-ink-900/15 rounded-sm px-3 py-2 bg-parchment-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="eyebrow block mb-1">Fuel Type</label>
                <input
                  required
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  placeholder="e.g. DIESEL, CNG, PETROL"
                  className="w-full border border-ink-900/15 rounded-sm px-3 py-2 bg-parchment-100"
                />
              </div>
              <div>
                <label className="eyebrow block mb-1">Odometer Mileage (km)</label>
                <input
                  type="number"
                  required
                  value={mileage}
                  onChange={(e) => setMileage(Number(e.target.value))}
                  className="w-full border border-ink-900/15 rounded-sm px-3 py-2 bg-parchment-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-ink-900/10">
              <Link to="/vehicles">
                <Button variant="secondary">Cancel</Button>
              </Link>
              <Button type="submit" disabled={save.isPending}>
                {isNew ? 'Create Vehicle' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
