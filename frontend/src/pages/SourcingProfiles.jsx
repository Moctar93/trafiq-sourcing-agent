import React, { useState } from "react";
import { Save, Check, Loader2 } from "lucide-react";

const SECTORS_LIST = [
  "SaaS",
  "Fintech",
  "E-commerce",
  "Santé",
  "Industrie",
  "Éducation",
  "Marketing",
  "Logistique",
  "Énergie",
  "Retail",
];

const REGIONS_LIST = [
  "Toutes les régions",
  "Île-de-France",
  "Auvergne-Rhône-Alpes",
  "Nouvelle-Aquitaine",
  "Occitanie",
  "Hauts-de-France",
  "International",
];

export default function SourcingProfile() {
  const [name, setName] = useState("Startups SaaS Paris");
  const [region, setRegion] = useState("Île-de-France");
  const [selectedSectors, setSelectedSectors] = useState(["SaaS", "Fintech"]);
  const [minEmployees, setMinEmployees] = useState(10);
  const [maxEmployees, setMaxEmployees] = useState(500);

  // Pondérations des critères (0 à 100%)
  const [fitWeight, setFitWeight] = useState(50);
  const [needWeight, setNeedWeight] = useState(50);
  const [intentWeight, setIntentWeight] = useState(50);

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  // Toggle la sélection d'un secteur
  const toggleSector = (sector) => {
    if (selectedSectors.includes(sector)) {
      setSelectedSectors(selectedSectors.filter((s) => s !== sector));
    } else {
      setSelectedSectors([...selectedSectors, sector]);
    }
  };

  // Soumission vers l'API Django REST
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(false);

    const payload = {
      name,
      region,
      target_sectors: selectedSectors.join(","),
      min_employees: minEmployees,
      max_employees: maxEmployees,
      fit_weight: fitWeight,
      need_weight: needWeight,
      intent_weight: intentWeight,
    };

    try {
      const res = await fetch("http://localhost:8000/api/profiles/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccessMessage(true);
        setTimeout(() => setSuccessMessage(false), 3000);
      } else {
      const errorData = await res.json();
      console.error("Erreur Backend 400/500 :", errorData);
    }
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="-m-6 p-4 sm:p-6 lg:p-8 min-h-screen bg-blue-600 font-sans text-slate-900">
      <form onSubmit={handleSave} className="max-w-4xl mx-auto space-y-6">
        {/* Header Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Trafiq AI Sourcing Agent
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 mt-1">
              Configurez votre profil de sourcing intelligent
            </p>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-xl shadow-lg transition-all text-sm shrink-0"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Enregistrer le profil
          </button>
        </div>

        {successMessage && (
          <div className="bg-emerald-500 text-white p-4 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg">
            <Check className="w-5 h-5" /> Profil enregistré avec succès dans la
            base de données !
          </div>
        )}

        {/* SECTION 1 : Informations de base */}
        <div className="bg-white rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
              1
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Informations de base
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                Nom du profil
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ex. Startups SaaS Paris"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                Région
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
              >
                {REGIONS_LIST.map((reg) => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2 : Critères cibles */}
        <div className="bg-white rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
              2
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Critères cibles
            </h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-3">
              Secteurs
            </label>
            <div className="flex flex-wrap gap-2">
              {SECTORS_LIST.map((sector) => {
                const isSelected = selectedSectors.includes(sector);
                return (
                  <button
                    key={sector}
                    type="button"
                    onClick={() => toggleSector(sector)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <span>{isSelected ? "✓" : "+"}</span>
                    {sector}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-500">
                Effectif
              </label>
              <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-lg">
                {minEmployees} – {maxEmployees} employés
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={maxEmployees}
              onChange={(e) => setMaxEmployees(Number(e.target.value))}
              className="w-full accent-slate-900 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-bold text-slate-400 mt-1">
              <span>10</span>
              <span>1000</span>
            </div>
          </div>
        </div>

        {/* SECTION 3 : Importance des critères */}
        <div className="bg-white rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
              3
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Importance des critères
            </h2>
          </div>

          <div className="space-y-5">
            {/* Fit Slider */}
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-bold text-sm text-slate-900">Fit</span>
                  <p className="text-xs text-slate-400">
                    Adéquation avec votre solution
                  </p>
                </div>
                <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-lg">
                  {fitWeight}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={fitWeight}
                onChange={(e) => setFitWeight(Number(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer"
              />
            </div>

            {/* Need Slider */}
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-bold text-sm text-slate-900">Need</span>
                  <p className="text-xs text-slate-400">
                    Besoin exprimé ou latent
                  </p>
                </div>
                <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-lg">
                  {needWeight}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={needWeight}
                onChange={(e) => setNeedWeight(Number(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer"
              />
            </div>

            {/* Intent Slider */}
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-bold text-sm text-slate-900">
                    Intent
                  </span>
                  <p className="text-xs text-slate-400">
                    Intention d'achat détectée
                  </p>
                </div>
                <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-lg">
                  {intentWeight}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={intentWeight}
                onChange={(e) => setIntentWeight(Number(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Bouton de bas de page (Mobile) */}
        <div className="block sm:hidden pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-xl shadow-lg transition-all text-sm"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Enregistrer le profil
          </button>
        </div>
      </form>
    </div>
  );
}
