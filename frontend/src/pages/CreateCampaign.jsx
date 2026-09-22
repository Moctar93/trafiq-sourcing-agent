import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Rocket } from 'lucide-react';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    profile_id: '',
  });
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await api.get('/campaigns/create/');
        if (response.data.profiles) {
          setProfiles(response.data.profiles);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des profils :', err);
      }
    };
    fetchFormData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!formData.name.trim()) {
      setError('Veuillez saisir un nom pour la campagne.');
      return;
    }

    if (!formData.profile_id) {
      setError('Veuillez sélectionner un profil sourcing.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/campaigns/create/', formData);
      if (res.status === 201 || res.status === 200) {
        navigate('/campaigns');
      }
    } catch (err) {
      console.error('Erreur lors de la création :', err);
      setError(
        err.response?.data?.error || 
        'Impossible de créer la campagne.'
      );
      setLoading(false);
    }
  };

  return (
    /* Conteneur flex centré verticalement dans la hauteur disponible sous la Navbar */
    <div className="flex flex-col justify-center min-h-[calc(100vh-160px)]">
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm w-full">
        <div className="mb-6">
          <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
            NOUVELLE CAMPAGNE
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Lancer un nouveau Sourcing
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configurez le nom et le profil cible pour lancer la qualification automatisée par IA.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm font-semibold rounded-xl border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Nom de la campagne *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Recrutement Développeurs Full-Stack - Q4"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-slate-800 text-sm transition"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Profil Sourcing associé *
            </label>
            <select
              value={formData.profile_id}
              onChange={(e) => setFormData({ ...formData, profile_id: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-slate-800 text-sm transition bg-white"
            >
              <option value="">-- Sélectionnez un profil --</option>
              {profiles.map((p) => (
                <option key={p.id_profile} value={p.id_profile}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate('/campaigns')}
              className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 text-sm transition cursor-pointer"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold py-3 px-8 rounded-xl shadow-md transition text-sm disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Lancement en cours...</span>
              ) : (
                <>
                  <Rocket className="w-4 h-4" />
                  <span>Lancer la campagne</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;