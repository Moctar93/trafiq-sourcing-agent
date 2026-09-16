import react from 'react';
import { Routes, Route  } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Dashboard from '../pages/Dachboard';
import ProspectDetail from '../pages/ProspectDetail';
import SourcingProfile from '../pages/SourcingProfiles';

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path='/' element={<Dashboard />} />
                <Route path="/prospects/:id" element={<ProspectDetail />} />
                <Route path='/sourcing-profile' element={<SourcingProfile />} />
            </Route>
        </Routes>
    )
}