import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CustomerJourney from './pages/CustomerJourney'
import InventoryDashboard from './pages/InventoryDashboard'
import DemandPrediction from './pages/DemandPrediction'
import ReplenishmentSuggestions from './pages/ReplenishmentSuggestions'
import POGenerator from './pages/POGenerator'
import MultiPlatformSync from './pages/MultiPlatformSync'
import AutonomousReorderAgent from './pages/AutonomousReorderAgent'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/journey" element={<CustomerJourney />} />
        <Route path="/inventory" element={<InventoryDashboard />} />
        <Route path="/demand" element={<DemandPrediction />} />
        <Route path="/replenishment" element={<ReplenishmentSuggestions />} />
        <Route path="/po-generator" element={<POGenerator />} />
        <Route path="/multi-platform-sync" element={<MultiPlatformSync />} />
        <Route path="/autonomous-reorder-agent" element={<AutonomousReorderAgent />} />
      </Routes>
    </BrowserRouter>
  )
}
