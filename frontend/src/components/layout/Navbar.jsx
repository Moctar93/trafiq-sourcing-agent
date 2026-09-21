import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Plus, ChevronDown, Sliders, Upload, PlayCircle, Terminal } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { label: 'Profil Sourcing', path: '/sourcing-profile', icon: Sliders },
    { label: 'Import', path: '/import', icon: Upload },
    { label: 'Campagnes', path: '/campaigns', icon: PlayCircle },
    { label: 'Audit ML', path: '/audit', icon: Terminal },
  ];

  return (
    <header className="bg-white rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4 mb-6">
      {/* Brand & Organization Selector */}
      <div className="flex items-center gap-4">
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 pr-4 border-r border-gray-100 cursor-pointer select-none"
        >
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            ◎
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 leading-tight">Trafiq</span>
            <span className="text-xs text-gray-400">Sourcing</span>
          </div>
        </div>

        {/* Organization Dropdown */}
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors">
          <div className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
            A
          </div>
          <span className="hidden sm:inline">Acme Corp</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
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

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Search Input */}
        <div className="hidden md:flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl text-sm text-gray-500 border border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="bg-transparent border-none outline-none w-32 xl:w-48 text-gray-700 placeholder-gray-400 text-xs"
          />
        </div>

        {/* CTA Button -> Redirige vers la Vue Campagnes */}
        <button 
          onClick={() => navigate('/campaigns/create')}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-2" />
          <span>Nouvelle Campagne</span>
        </button>
      </div>
    </header>
  );
}