import React from 'react';
import { Search, Plus, ChevronDown } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4 mb-6">
      {/* Brand & Organization Selector */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 pr-4 border-r border-gray-100">
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
          <span>Acme Corp</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Search Input (Desktop & Tablet) */}
      <div className="hidden md:flex flex-1 max-w-xs items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl text-sm text-gray-500 border border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all">
        <Search className="w-4 h-4 text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="Rechercher une entreprise, un signal..."
          className="bg-transparent border-none outline-none w-full text-gray-700 placeholder-gray-400 text-sm"
        />
      </div>

      {/* Search Button (Mobile) */}
      <button className="md:hidden p-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl transition-colors">
        <Search className="w-5 h-5" />
      </button>

      {/* CTA Button */}
      <button className="hidden sm:flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer">
        <Plus className="w-4 h-4 stroke-2" />
        <span>Nouvelle Campagne</span>
      </button>
    </header>
  );
}