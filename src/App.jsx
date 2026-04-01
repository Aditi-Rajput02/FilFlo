import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppShell from './components/AppShell'

// ── Main pages ──────────────────────────────────────────────────────────────
import Home                     from './pages/Home'
import SiteOverview             from './pages/SiteOverview'
import CustomerJourney          from './pages/CustomerJourney'
import InventoryDashboard       from './pages/InventoryDashboard'
import DemandPrediction         from './pages/DemandPrediction'
import ReplenishmentSuggestions from './pages/ReplenishmentSuggestions'
import POGenerator              from './pages/POGenerator'
import MultiPlatformSync        from './pages/MultiPlatformSync'
import AutonomousReorderAgent   from './pages/AutonomousReorderAgent'

// ── Demo pages ───────────────────────────────────────────────────────────────
import InventoryDemo         from './pages/demo/phase1/InventoryDemo'
import DemandPredictionDemo  from './pages/demo/phase2/DemandPredictionDemo'
import ReplenishmentDemo     from './pages/demo/phase3/ReplenishmentDemo'
import POGeneratorDemo       from './pages/demo/phase4/POGeneratorDemo'
import MultiPlatformSyncDemo from './pages/demo/phase5/MultiPlatformSyncDemo'
import AutonomousAgentDemo   from './pages/demo/phase6/AutonomousAgentDemo'

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/"                         element={<Home />} />
          <Route path="/overview"                 element={<SiteOverview />} />
          <Route path="/journey"                  element={<CustomerJourney />} />
          <Route path="/inventory"                element={<InventoryDashboard />} />
          <Route path="/demand"                   element={<DemandPrediction />} />
          <Route path="/replenishment"            element={<ReplenishmentSuggestions />} />
          <Route path="/po-generator"             element={<POGenerator />} />
          <Route path="/multi-platform-sync"      element={<MultiPlatformSync />} />
          <Route path="/autonomous-reorder-agent" element={<AutonomousReorderAgent />} />
          <Route path="/demo/inventory"           element={<InventoryDemo />} />
          <Route path="/demo/demand"              element={<DemandPredictionDemo />} />
          <Route path="/demo/replenishment"       element={<ReplenishmentDemo />} />
          <Route path="/demo/po-generator"        element={<POGeneratorDemo />} />
          <Route path="/demo/multi-platform-sync" element={<MultiPlatformSyncDemo />} />
          <Route path="/demo/autonomous-agent"    element={<AutonomousAgentDemo />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  )
}
