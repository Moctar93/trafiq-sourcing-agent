import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sliders, Upload, PlayCircle, Terminal, LogOut, User, Menu, X } from 'lucide-react';
import logoTrafiq from '../../assets/logo-trafiq.jpeg';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Erreur de lecture de l'utilisateur", e);
      }
    }
  }, []);

  // Libellés du menu traduits en français
  const navLinks = [
    { label: 'Profil de sourcing', path: '/sourcing-profile', icon: Sliders },
    { label: 'Import', path: '/import', icon: Upload },
    { label: 'Campagnes', path: '/campaigns', icon: PlayCircle },
    { label: 'Audit ML', path: '/audit', icon: Terminal },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const displayName = currentUser?.first_name
    ? `${currentUser.first_name} ${currentUser.last_name || ''}`.trim()
    : currentUser?.username || 'Utilisateur';

  const avatarInitial = displayName.charAt(0).toUpperCase();

  return (
    <header className="bg-white rounded-2xl p-4 shadow-sm mb-6 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Brand & Navigation Bureau */}
        <div className="flex items-center gap-6">
          <div 
            onClick={() => handleNavigate('/')} 
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

          <nav className="hidden lg:flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavigate(link.path)}
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

        {/* Profil Utilisateur Dynamique, Déconnexion & Bouton Burger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
            <div className="w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-xs shrink-0">
              {currentUser ? avatarInitial : <User className="w-4 h-4" />}
            </div>
            <span className="text-xs font-semibold text-gray-800 hidden sm:inline">
              {displayName}
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

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-100 transition-colors"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Navigation Mobile */}
      {isOpen && (
        <nav className="lg:hidden mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.path}
                onClick={() => handleNavigate(link.path)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all w-full cursor-pointer ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 font-bold' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
}