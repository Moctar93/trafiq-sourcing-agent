import React, { useState, useEffect } from 'react';
// MODIFICATION 1 : Ajout de Loader2 pour l'indicateur de chargement
import { Users, Gauge, Zap, Search, Filter, ExternalLink, ArrowUpRight, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  // Création des états pour stocker les données de l'API, le chargement et les erreurs
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Appel asynchrone à l'API Django REST lors du montage du composant
  useEffect(() => {
    fetch('http://localhost:8000/api/companies/')
      .then((res) => {
        if (!res.ok) throw new Error('Erreur lors de la récupération des données');
        return res.json();
      })
      .then((data) => {
        setCompanies(data); // Stockage des entreprises issues de MySQL
        setLoading(false);  // Fin du chargement
      })
      .catch((err) => {
        setError(err.message); // Capture de l'erreur réseau ou serveur
        setLoading(false);
      });
  }, []);

  // Filtrage dynamique basé sur les données réelles au lieu du tableau statique
  const filteredCompanies = companies.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.sector && item.sector.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Dynamic Header / Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Vue d'ensemble</h1>
          <p className="text-sm text-slate-900 mt-1">Suivi en temps réel de vos opportunités d'affaires et signaux d'intention.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une entreprise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-64 shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <Filter className="w-4 h-4 text-slate-500" />
            <span>Filtres</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Utilisation du nombre réel d'entreprises (companies.length) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-start hover:border-slate-200 transition-all">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Prospects</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-2">{companies.length}</h3>
            <span className="inline-flex items-center text-xs font-medium text-emerald-600 mt-2 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              Base MySQL
            </span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Score Moyen */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-start hover:border-slate-200 transition-all">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Score Moyen</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-2">78 / 100</h3>
            <span className="inline-flex items-center text-xs font-medium text-emerald-600 mt-2 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              Model v1.0
            </span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Gauge className="w-5 h-5" />
          </div>
        </div>

        {/* Calcul dynamique du nombre total de signaux cumulés */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-start hover:border-slate-200 transition-all">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Signaux Détectés</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-2">
              {companies.reduce((acc, curr) => acc + (curr.signals ? curr.signals.length : 0), 0)}
            </h3>
            <span className="inline-flex items-center text-xs font-medium text-emerald-600 mt-2 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              Temps réel
            </span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Zap className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Top Prospects Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-slate-900">Top Prospects Détectés</h2>
            <p className="text-xs text-slate-500 mt-0.5">Données issues de l'API REST Django / MySQL.</p>
          </div>
          <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
            Voir tous les prospects
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Affichage conditionnel selon l'état (Chargement, Erreur ou Tableau) */}
        {loading ? (
          <div className="p-12 flex justify-center items-center text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-sm">Chargement des prospects...</span>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-500 text-sm">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3.5 px-6">Entreprise</th>
                  <th className="py-3.5 px-4">Secteur</th>
                  <th className="py-3.5 px-4">Effectif</th>
                  <th className="py-3.5 px-4">Signal Clé</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {/* Boucle map sur filteredCompanies avec les clés réelles du JSON (id_company, latest_signal, employee_count) */}
                {filteredCompanies.map((item) => (
                  <tr key={item.id_company} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-slate-900 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0 border border-slate-200">
                        {item.name.substring(0, 2).toUpperCase()}
                      </span>
                      {item.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-medium">{item.sector || 'N/A'}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{item.employee_count} sal.</td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{item.latest_signal}</td>
                    <td className="py-3.5 px-6 text-right">
                      <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors">
                        <span>Détails</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}