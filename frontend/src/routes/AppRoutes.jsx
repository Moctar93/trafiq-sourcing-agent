import React from 'react';
import { Routes, Route  } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Dashboard from '../pages/Dachboard';
import ProspectDetail from '../pages/ProspectDetail';
import SourcingProfile from '../pages/SourcingProfiles';
import ImportProspects from '../pages/ImportProspects';
import Campaigns from '../pages/Campaigns';
import CreateCampaign from '../pages/CreateCampaign';
import AuditML from '../pages/AuditML'
import CampaignDetail from '../pages/CampaignDetail';
import Login from '../pages/Login';

export default function AppRoutes() {
    return (
        <Routes>

            <Route path='/login' element={<Login />} />

            <Route element={<Layout />}>
                <Route path='/' element={<Dashboard />} />
                <Route path="/prospects/:id" element={<ProspectDetail />} />
                <Route path='/sourcing-profile' element={<SourcingProfile />} />
                <Route path='/import' element={<ImportProspects />} />
                <Route path='/campaigns' element={<Campaigns />} />
                <Route path='/campaigns/create' element={<CreateCampaign />} />
                <Route path='/audit' element={<AuditML />} />
                <Route path='/campaigns/:id' element={<CampaignDetail />} />              
            </Route>
        </Routes>
    )
}