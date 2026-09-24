import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
    const token = localStorage.getItem('token');

    // Si pas de token, redirection immédiate vers /login

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Si connecté, affichage des routes enfants
    return <Outlet />;
}