import React, { useState, useRef } from 'react'; // Ajout de useRef pour cibler l'input file caché
import { CloudUpload, Sparkles } from 'lucide-react';
import axios from '../api/axios';

const initialProspects = [
  { id: 1, name: 'Logitrans SAS', website: 'logitrans.fr', status: 'Nouveau', action: 'Conserver' },
  { id: 2, name: 'Groupe Bernard', website: 'groupe-bernard.fr', status: 'Doublon détecté', action: 'Fusionner' },
  { id: 3, name: 'Fret Atlantique', website: 'fret-atlantique.com', status: 'Nouveau', action: 'Conserver' },
  { id: 4, name: 'TransAlpes Cargo', website: 'transalpes-cargo.fr', status: 'Doublon détecté', action: 'Fusionner' },
  { id: 5, name: 'Nord Express', website: 'nordexpress.fr', status: 'Nouveau', action: 'Conserver' },
];

export default function ImportProspects() {
  const [prospects, setProspects] = useState(initialProspects);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);

  // Référence pour ouvrir la fenêtre de sélection de fichier au clic
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Traitement du fichier déposé en Dropzone ou sélectionné manuellement
  const handleFile = (file) => {
    if (!file) return;
    
    // Exemple d'interception : si c'est un fichier JSON, on peut pré-remplir l'aperçu
    if (file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (Array.isArray(parsed)) {
            setProspects(parsed);
          }
        } catch (err) {
          console.error("Format JSON invalide", err);
        }
      };
      reader.readAsText(file);
    } else {
      // Pour les fichiers CSV, le traitement ou parsing se fera à la réception
      console.log("Fichier prêt à l'envoi :", file.name);
    }
  };

  // Gestion de l'événement de drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Gestion de la sélection de fichier via le navigateur de fichiers
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const toggleAction = (id) => {
    setProspects((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, action: p.action === 'Fusionner' ? 'Conserver' : 'Fusionner' }
          : p
      )
    );
  };

  const handleImport = async () => {
    setLoading(true);
    try {
      await axios.post('/import-prospects/', { prospects });
      alert('Importation et Scoring ML lancés avec succès !');
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'importation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2563EB] p-4 sm:p-6 md:p-8 text-slate-800">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <p className="text-xs font-bold tracking-widest text-blue-100 uppercase">
            Trafiq AI Sourcing Agent
          </p>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            Import de prospects
          </h1>
        </div>

        {/* Dropzone */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm">
          {/* Input file masqué déclenché au clic sur le bloc Dropzone */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv, .json"
            onChange={handleFileChange}
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()} //  Clic sur le container ouvre le sélecteur de fichiers
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop} 
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-colors cursor-pointer ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-blue-200 bg-slate-50/50'
            }`}
          >
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CloudUpload className="w-6 h-6" />
            </div>
            <p className="text-lg font-bold text-slate-800">Glissez votre fichier ici</p>
            <p className="text-sm text-slate-500 mt-1">CSV ou JSON — ou cliquez pour parcourir</p>
          </div>
        </div>

        {/* Tableau Aperçu */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm overflow-hidden">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Aperçu & doublons</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pr-4">Entreprise</th>
                  <th className="pb-3 px-4">Site Web</th>
                  <th className="pb-3 px-4 hidden sm:table-cell">Statut</th>
                  <th className="pb-3 pl-4 text-right sm:text-left hidden sm:table-cell">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {prospects.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 pr-4 font-bold text-slate-800">{item.name}</td>
                    <td className="py-4 px-4 text-slate-500 truncate max-w-[120px] sm:max-w-none">{item.website}</td>
                    <td className="py-4 px-4 hidden sm:table-cell">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'Doublon détecté' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 pl-4 text-right sm:text-left hidden sm:table-cell">
                      <button
                        onClick={() => toggleAction(item.id)}
                        className="px-4 py-1.5 border border-slate-200 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        {item.action}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bouton Action */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm">
          <button
            onClick={handleImport}
            disabled={loading}
            className="w-full bg-[#F59E0B] hover:bg-amber-600 active:scale-[0.99] text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-70"
          >
            <Sparkles className="w-5 h-5" />
            <span>{loading ? 'Traitement en cours...' : 'Importer et Lancer le Scoring ML'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}