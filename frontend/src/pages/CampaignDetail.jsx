import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

export default function CampaignDetail() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaignDetail = async () => {
      try {
        const response = await api.get(`/campaigns/${id}/`);
        setCampaign(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération de la campagne :", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCampaignDetail();
    }
  }, [id]);

  if (loading) return <div className="p-6">Chargement de la campagne...</div>;
  if (!campaign) return <div className="p-6">Campagne introuvable.</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Link to="/campaigns" className="text-sm text-blue-600 hover:underline">
            ← Retour aux campagnes
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">{campaign.name}</h1>
          <p className="text-sm text-gray-900 font-semibold">Profil : {campaign.profile_name}</p>
        </div>
        <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
          {campaign.status}
        </span>
      </div>

      {/* Cartes KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500">Progression</p>
          <p className="text-2xl font-bold text-gray-900">{campaign.progress}%</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500">Total Prospects</p>
          <p className="text-2xl font-bold text-gray-900">{campaign.total_prospects}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500">Prospects Qualifiés (Score ≥ 70)</p>
          <p className="text-2xl font-bold text-green-600">{campaign.qualified_prospects}</p>
        </div>
      </div>

      {/* Tableau des prospects */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Prospects de la campagne</h2>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-3">Entreprise</th>
              <th className="px-6 py-3">Secteur</th>
              <th className="px-6 py-3">Site Web</th>
              <th className="px-6 py-3">Score AI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {campaign.prospects && campaign.prospects.length > 0 ? (
              campaign.prospects.map((p) => (
                <tr key={p.id_company} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                  <td className="px-6 py-4 text-gray-500">{p.sector || "N/A"}</td>
                  <td className="px-6 py-4 text-blue-600">
                    {p.website ? (
                      <a href={p.website} target="_blank" rel="noreferrer">
                        {p.website}
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{p.score}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  Aucun prospect associé à cette campagne.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}