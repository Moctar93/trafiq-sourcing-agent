import React, { useState, useEffect } from "react";
import { 
  Cpu, 
  Activity, 
  Play, 
  Code2, 
  CheckCircle2, 
  BarChart3, 
  Building2, 
  Sparkles,
  Loader2 
} from "lucide-react";
import api from "../api/axios";

const mockCompanies = [
  { id: 1, name: "Logitrans SAS" },
  { id: 2, name: "Groupe Bernard" },
  { id: 3, name: "Fret Atlantique" },
  { id: 4, name: "TransAlpes Cargo" },
];

// Dictionnaire de traduction pour les valeurs dynamiques de l'API
const featureLabels = {
  sector_match: "Correspondance Secteur",
  size_fit: "Adéquation Taille",
  growth_rate: "Taux de Croissance",
};

const confidenceLabels = {
  High: "Élevée",
  Medium: "Moyenne",
  Low: "Faible",
};

const recommendationLabels = {
  Qualified: "Qualifiée",
  "Not Qualified": "Non Qualifiée",
  Pending: "En attente",
};

export default function AuditML() {
  const [companies, setCompanies] = useState(mockCompanies);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [jsonResult, setJsonResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("visual"); // "visual" | "json"
  const [apiStatus, setApiStatus] = useState({ online: true, message: "API 200 OK" });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get("/companies/");
        if (response.data && response.data.length > 0) {
          setCompanies(response.data);
        }
      } catch (err) {
        console.info("Utilisation des entreprises de démonstration (API non joignable).");
      }
    };
    fetchCompanies();
  }, []);

  const handleTestPrediction = async () => {
    if (!selectedCompany) return;
    setLoading(true);
    
    try {
      const response = await api.post("/audit-ml/predict/", {
        company_id: selectedCompany,
      });
      setJsonResult(response.data);
      setApiStatus({ online: true, message: "API 200 OK" });
    } catch (err) {
      console.error("Erreur lors de la prédiction :", err);
      setApiStatus({ online: false, message: "Mode Démo Actif" });
      
      const selectedObj = companies.find((c) => String(c.id) === String(selectedCompany));
      setJsonResult({
        status: "success",
        model_version: "v0.1-mock",
        company_id: selectedCompany,
        company_name: selectedObj ? selectedObj.name : "Entreprise inconnue",
        score: 0.87,
        confidence: "High",
        features_impact: {
          sector_match: 0.95,
          size_fit: 0.80,
          growth_rate: 0.85,
        },
        recommendation: "Qualified",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedCompanyName = companies.find(
    (c) => String(c.id) === String(selectedCompany)
  )?.name;

  return (
    <div className="w-full space-y-6">
      {/* 1. Entête */}
      <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-slate-100">
        <div>
          <span className="text-xs font-bold tracking-wider text-amber-500 uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5"/>
            AGENT DE SOURCING TRAFIQ AI
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Audit & Test du Modèle ML
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-xs font-semibold">
            <Cpu className="w-4 h-4"/>
            <span>Modèle actif · {jsonResult?.model_version || "v0.1-mock"}</span>
          </div>
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
              apiStatus.online
                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                : "bg-amber-50 text-amber-600 border-amber-100"
            }`}
          >
            <Activity className="w-4 h-4"/>
            <span>{apiStatus.message}</span>
          </div>
        </div>
      </div>

      {/* 2. Formulaire de test rapide */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">Test rapide</h2>
        <p className="text-sm text-slate-500 mt-1 mb-6">
          Choisissez une entreprise pour évaluer son score de sourcing.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          <div className="flex-1 relative">
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all cursor-pointer font-medium"
            >
              <option value="">Sélectionner une entreprise</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleTestPrediction}
            disabled={!selectedCompany || loading}
            className="bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm whitespace-nowrap"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin"/>
                <span>Calcul en cours...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current"/>
                <span>Tester la Prédiction</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Résultat d'analyse */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-slate-400"/>
            <h2 className="text-lg font-bold text-slate-900">
              Résultat d'audit {selectedCompanyName && `— ${selectedCompanyName}`}
            </h2>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
            <button
              onClick={() => setActiveTab("visual")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "visual"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "hover:text-slate-900"
              }`}
            >
              Vue Métier
            </button>
            <button
              onClick={() => setActiveTab("json")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "json"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "hover:text-slate-900"
              }`}
            >
              <Code2 className="w-3.5 h-3.5"/>
              JSON Brut
            </button>
          </div>
        </div>

        {activeTab === "visual" && (
          <div>
            {jsonResult ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      SCORE GLOBAL
                    </span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-4xl font-extrabold text-slate-900">
                        {Math.round(jsonResult.score * 100)}%
                      </span>
                      <span className="text-xs text-slate-500">
                        ({jsonResult.score} / 1.0)
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">Confiance</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                      {confidenceLabels[jsonResult.confidence] || jsonResult.confidence}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      Recommandation
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5"/>
                      {recommendationLabels[jsonResult.recommendation] || jsonResult.recommendation}
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-2 bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 block">
                    IMPACT DES CRITÈRES (PONDÉRATION)
                  </span>

                  <div className="space-y-3.5">
                    {jsonResult.features_impact &&
                      Object.entries(jsonResult.features_impact).map(([key, value]) => {
                        const percent = Math.round(value * 100);
                        const label = featureLabels[key] || key.replace("_", " ");
                        return (
                          <div key={key} className="space-y-1">
                            <div className="flex justify-between text-xs font-medium text-slate-700">
                              <span>{label}</span>
                              <span className="font-bold">{percent}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-12 text-center">
                <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3"/>
                <p className="text-sm font-medium text-slate-600">
                  Aucune prédiction exécutée
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Sélectionnez une entreprise ci-dessus puis cliquez sur "Tester la Prédiction".
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "json" && (
          <div className="bg-[#0f172a] rounded-xl p-4 sm:p-6 overflow-x-auto min-h-[220px]">
            <pre className="font-mono text-xs sm:text-sm text-slate-300 leading-relaxed">
              {jsonResult
                ? JSON.stringify(jsonResult, null, 2)
                : "// Sélectionnez une entreprise puis lancez une prédiction."}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}