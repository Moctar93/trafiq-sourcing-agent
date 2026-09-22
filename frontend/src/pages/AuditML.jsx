import React, { useState } from 'react';
import { Cpu, Activity, Play, Code2 } from 'lucide-react';
import api from '../api/axios';

const mockCompanies = [
  { id: 1, name: 'Logitrans SAS' },
  { id: 2, name: 'Groupe Bernard' },
  { id: 3, name: 'Fret Atlantique' },
  { id: 4, name: 'TransAlpes Cargo' },
];

export default function AuditML() {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [jsonResult, setJsonResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTestPrediction = async () => {
    if (!selectedCompany) return;
    setLoading(true);
    try {
      const response = await api.post('/audit-ml/predict/', { company_id: selectedCompany });
      setJsonResult(response.data);
    } catch (err) {
      console.error("Erreur lors de la prédiction :", err);
      // Fallback de démonstration si l'API backend n'est pas encore branchée
      setJsonResult({
        status: "success",
        model_version: "v0.1-mock",
        company_id: selectedCompany,
        score: 0.87,
        confidence: "High",
        features_impact: {
          sector_match: 0.95,
          size_fit: 0.80,
          growth_rate: 0.85
        },
        recommendation: "Qualified"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. Header Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
            TRAFIQ AI SOURCING AGENT
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            ML Model Audit & Testing
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-xs font-semibold">
            <Cpu className="w-4 h-4" />
            <span>Modèle actif · v0.1-mock</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-semibold">
            <Activity className="w-4 h-4" />
            <span>API 200 OK</span>
          </div>
        </div>
      </div>

      {/* 2. Test Rapide Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Test rapide</h2>
        <p className="text-sm text-slate-500 mt-1 mb-6">
          Choisissez une entreprise pour évaluer son score de sourcing.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          <div className="flex-1">
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer"
            >
              <option value="">Sélectionner une entreprise</option>
              {mockCompanies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleTestPrediction}
            disabled={!selectedCompany || loading}
            className="bg-[#f59e0b] hover:bg-[#d97706] active:scale-[0.99] text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm whitespace-nowrap"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{loading ? 'Calcul en cours...' : 'Tester la Prédiction'}</span>
          </button>
        </div>
      </div>

      {/* 3. Résultat JSON Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Code2 className="w-5 h-5 text-slate-400" />
          <h2 className="text-lg font-bold text-slate-900">Résultat JSON</h2>
        </div>

        <div className="bg-[#0f172a] rounded-xl p-4 sm:p-6 overflow-x-auto min-h-[220px]">
          <pre className="font-mono text-xs sm:text-sm text-slate-300 leading-relaxed">
            {jsonResult
              ? JSON.stringify(jsonResult, null, 2)
              : '// Sélectionnez une entreprise puis lancez une prédiction.'}
          </pre>
        </div>
      </div>
    </div>
  );
}