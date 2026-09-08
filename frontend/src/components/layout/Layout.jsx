import React from 'react';
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
    return (
        <div className='min-h-screen bg-blue-600 p-4 md::p-6 lg:p-8'>
            <div className='max-w-7xl mx-auto'>
                <Navbar />
                <main>
                    <Outlet />
                </main>
            </div>

        </div>

    );
}