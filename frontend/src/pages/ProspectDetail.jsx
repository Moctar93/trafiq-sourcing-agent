import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building2, Mail, Radio, Sparkles, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export default function ProspectDetail() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('Nouveau');

  useEffect(() => {
    fetch(`http://localhost:8000/api/companies/${id}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Impossible de charger les détails du prospect.");
        return res.json();
      })
      .then((data) => {
        setCompany(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col justify-center items-center text-white gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
        <p className="text-sm font-medium">Chargement de la fiche prospect...</p>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center text-center p-6 bg-white rounded-3xl max-w-lg mx-auto shadow-xl my-10">
        <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
        <h2 className="text-xl font-bold text-slate-900">Erreur de chargement</h2>
        <p className="text-sm text-slate-500 mt-1 mb-6">{error || "Prospect introuvable."}</p>
        <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Retour au Dashboard
        </Link>
      </div>
    );
  }

  // MODIFICATION : Extraction du score et de l'explication dynamiques depuis l'API MySQL
  const currentScoreObj = company.scores && company.scores.length > 0 ? company.scores[0] : null;
  const finalScore = currentScoreObj ? Math.round(currentScoreObj.final_score) : 'N/A';
  const explanation = currentScoreObj ? currentScoreObj.explanation : null;

  return (
    <div className="-m-6 p-6 min-h-screen bg-blue-600 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto mb-6">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-blue-100 hover:text-white mb-3 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          Retour au tableau de bord
        </Link>
        <p className="text-xs font-bold tracking-widest text-blue-200 uppercase">TRAFIQ AI SOURCING AGENT</p>
        <h1 className="text-3xl font-extrabold text-white mt-1">Détail du prospect</h1>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLONNE 1 : Fiche Entreprise */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 border border-blue-100">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              {/* MODIFICATION : Nom dynamique de l'entreprise */}
              <h2 className="text-xl font-bold text-slate-900 leading-snug">{company.name}</h2>
              <p className="text-xs text-slate-400 font-medium">Fiche entreprise</p>
            </div>
          </div>

          <div className="space-y-4 text-sm divide-y divide-slate-100 pt-2">
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">SECTEUR</span>
              {/* MODIFICATION : Secteur dynamique */}
              <span className="font-bold text-slate-800">{company.sector || 'Non renseigné'}</span>
            </div>

            <div className="flex justify-between items-center pt-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">EFFECTIF</span>
              {/* MODIFICATION : Effectif dynamique */}
              <span className="font-bold text-slate-800">{company.employee_count} employés</span>
            </div>

            <div className="flex justify-between items-center pt-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">SITE WEB</span>
              {/* MODIFICATION : Site web dynamique (au lieu de la ville en dur) */}
              <span className="font-bold text-slate-800">{company.website || 'Non renseigné'}</span>
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">STATUT</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer shadow-sm"
            >
              <option value="Nouveau">Nouveau</option>
              <option value="En cours">En cours</option>
              <option value="Qualifié">Qualifié</option>
              <option value="Converti">Converti</option>
            </select>
          </div>
        </div>

        {/* COLONNE 2 : Contacts Clés & Signaux Récents */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">CONTACTS CLÉS</h3>
            <div className="space-y-3">
              {/* MODIFICATION : Boucle sur les vrais contacts renvoyés par l'API */}
              {company.contacts && company.contacts.length > 0 ? (
                company.contacts.map((contact) => (
                  <div key={contact.id_contact} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm">{contact.first_name} {contact.last_name}</h4>
                    <p className="text-xs text-slate-500">{contact.position || 'Poste non renseigné'}</p>
                    {contact.email && (
                      <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:underline pt-1">
                        <Mail className="w-3.5 h-3.5" />
                        {contact.email}
                      </a>
                    )}
                  </div>
                ))
              ) : (
                /* MODIFICATION : Message clair si le tableau contacts est vide en BDD */
                <p className="text-xs text-slate-400 italic">Aucun contact enregistré pour ce prospect.</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">SIGNAUX RÉCENTS</h3>
            <div className="space-y-3">
              {/* MODIFICATION : Boucle sur les vrais signaux de la BDD */}
              {company.signals && company.signals.length > 0 ? (
                company.signals.map((sig) => (
                  <div key={sig.id_signal} className="flex items-start gap-3 text-xs text-slate-700 font-medium">
                    <Radio className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">{sig.signal_type}</strong> — {sig.value}</span>
                  </div>
                ))
              ) : (
                /* MODIFICATION : Message si aucun signal en BDD */
                <p className="text-xs text-slate-400 italic">Aucun signal récent détecté.</p>
              )}
            </div>
          </div>
        </div>

        {/* COLONNE 3 : AI Intelligence & Scoring */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI INTELLIGENCE</h3>
          </div>

          <div className="text-center py-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2">FINAL SCORE</span>
            {/* MODIFICATION : Score dynamisé (affiche finalScore calculé plus haut) */}
            <div className="inline-flex items-center justify-center bg-emerald-100/70 text-emerald-600 font-black text-5xl px-8 py-4 rounded-2xl w-full max-w-55">
              {finalScore}{typeof finalScore === 'number' ? '%' : ''}
            </div>
          </div>

          <div className="bg-blue-50/60 rounded-2xl p-5 space-y-4 border border-blue-100/50 text-xs">
            {/* MODIFICATION : Affichage dynamique de l'explication du score */}
            {explanation ? (
              <div>
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  Analyse d'opportunité
                </h4>
                <p className="text-slate-600 leading-relaxed pl-3">{explanation}</p>
              </div>
            ) : (
              <p className="text-slate-500 italic">Aucune explication générée pour le moment.</p>
            )}
          </div>

          <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-amber-500/20 transition-all text-sm">
            Contacter ce prospect
          </button>
        </div>

      </div>
    </div>
  );
}