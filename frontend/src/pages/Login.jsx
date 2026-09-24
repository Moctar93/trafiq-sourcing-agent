import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import logoTrafiq from '../assets/logo-trafiq.jpeg';
import { Lock, User, AlertCircle, LogIn } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Endpoint correspondant à sourcing/api/urls.py
      const response = await api.post('/auth/login/', credentials);
      
      const token = response.data.access;
      if (token) {
        localStorage.setItem('token', token);
        if (response.data.refresh) {
          localStorage.setItem('refresh_token', response.data.refresh);
        }
        navigate('/');
      } else {
        setError("Jeton d'accès non reçu.");
      }
    } catch (err) {
      console.error('Erreur de connexion :', err);
      if (err.response && err.response.status === 401) {
        setError('Identifiants incorrects.');
      } else {
        setError('Impossible de se connecter au serveur.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6">
        
        {/* Header / Logo */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center bg-gray-50 border border-gray-100 shrink-0">
            <img src={logoTrafiq} alt="Trafiq Logo" className="w-full h-full object-contain p-1" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Trafiq Sourcing</h1>
          <p className="text-xs text-slate-500">Connectez-vous pour accéder à votre espace</p>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="flex items-center gap-2 p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nom d'utilisateur
            </label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                required
                placeholder="Ex: admin"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Mot de passe
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Connexion...' : 'Se connecter'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}