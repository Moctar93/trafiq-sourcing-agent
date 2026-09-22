import react from 'react';
import { Routes, Route  } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Dashboard from '../pages/Dachboard';
import ProspectDetail from '../pages/ProspectDetail';
import SourcingProfile from '../pages/SourcingProfiles';
import ImportProspects from '../pages/ImportProspects';
import Campaigns from '../pages/Campaigns';
import CreateCampaign from '../pages/CreateCampaign';
import AuditML from '../pages/AuditML'

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path='/' element={<Dashboard />} />
                <Route path="/prospects/:id" element={<ProspectDetail />} />
                <Route path='/sourcing-profile' element={<SourcingProfile />} />
                <Route path='/import' element={<ImportProspects />} />
                <Route path='/campaigns' element={<Campaigns />} />
                <Route path='/campaigns/create' element={<CreateCampaign />} />
                <Route path='/audit' element={<AuditML />} />
    
            </Route>
        </Routes>
    )
}