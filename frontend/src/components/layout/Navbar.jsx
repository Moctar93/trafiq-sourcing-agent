import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sliders, Upload, PlayCircle, Terminal, LogOut, User } from 'lucide-react';
import logoTrafiq from '../../assets/logo-trafiq.jpeg'; // Ajuste le chemin selon ton dossier

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { label: 'Profil Sourcing', path: '/sourcing-profile', icon: Sliders },
    { label: 'Import', path: '/import', icon: Upload },
    { label: 'Campagnes', path: '/campaigns', icon: PlayCircle },
    { label: 'Audit ML', path: '/audit', icon: Terminal },
  ];

  const handleLogout = () => {
    // Suppression des tokens d'authentification
    localStorage.removeItem('token');
    localStorage.removeItem('access_token');
    // Redirection vers la page de login
    navigate('/login');
  };

  return (
    <header className="bg-white rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4 mb-6">
      {/* Brand & Navigation */}
      <div className="flex items-center gap-6">
        {/* Logo & Titre */}
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-gray-50 border border-gray-100 shrink-0">
            <img 
              src={logoTrafiq} 
              alt="Trafiq Logo" 
              className="w-full h-full object-contain p-0.5"
            />
          </div>

          <div className="flex flex-col">
            <span className="font-bold text-gray-900 leading-tight">Trafiq</span>
            <span className="text-xs text-gray-400">Sourcing</span>
          </div>
        </div>

        {/* Quick Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Profil Utilisateur & Déconnexion (À droite de la navigation) */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
          <div className="w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-xs shrink-0">
            <User className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-gray-800 hidden sm:inline">
            Utilisateur
          </span>
        </div>

        <button
          onClick={handleLogout}
          title="Se déconnecter"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-100 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Déconnexion</span>
        </button>
      </div>
    </header>
  );
}