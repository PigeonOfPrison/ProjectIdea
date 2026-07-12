import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import Dashboard from '@/pages/Dashboard'
import VehiclesList from '@/pages/Vehicles/VehiclesList'
import VehicleDetail from '@/pages/Vehicles/VehicleDetail'
import VehicleForm from '@/pages/Vehicles/VehicleForm'
import DriversList from '@/pages/Drivers/DriversList'
import DriverDetail from '@/pages/Drivers/DriverDetail'
import DriverForm from '@/pages/Drivers/DriverForm'
import TripsList from '@/pages/Trips/TripsList'
import TripDetail from '@/pages/Trips/TripDetail'
import TripForm from '@/pages/Trips/TripForm'
import MaintenanceList from '@/pages/Maintenance/MaintenanceList'
import MaintenanceForm from '@/pages/Maintenance/MaintenanceForm'
import FuelLogsList from '@/pages/FuelLogs/FuelLogsList'
import FuelLogForm from '@/pages/FuelLogs/FuelLogForm'
import Reports from '@/pages/Reports'
import Settings from '@/pages/Settings'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/vehicles" element={<VehiclesList />} />
        <Route path="/vehicles/new" element={<VehicleForm />} />
        <Route path="/vehicles/:id" element={<VehicleDetail />} />
        <Route path="/vehicles/:id/edit" element={<VehicleForm />} />
        <Route path="/drivers" element={<DriversList />} />
        <Route path="/drivers/new" element={<DriverForm />} />
        <Route path="/drivers/:id" element={<DriverDetail />} />
        <Route path="/drivers/:id/edit" element={<DriverForm />} />
        <Route path="/trips" element={<TripsList />} />
        <Route path="/trips/new" element={<TripForm />} />
        <Route path="/trips/:id" element={<TripDetail />} />
        <Route path="/maintenance" element={<MaintenanceList />} />
        <Route path="/maintenance/new" element={<MaintenanceForm />} />
        <Route path="/fuel-logs" element={<FuelLogsList />} />
        <Route path="/fuel-logs/new" element={<FuelLogForm />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}
