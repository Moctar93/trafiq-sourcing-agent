import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Campaigns = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    active_campaigns_count: 3,
    qualified_rate_avg: 28,
    campaigns: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await api.get("/campaigns/");
        if (response.data.campaigns) {
          setData(response.data);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des campagnes :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  // Données de secours si la BDD est vide
  const mockCampaigns = [
    {
      id_campaign: 1,
      name: "Recrutement Développeurs Full-Stack",
      profile_name: "Tech Senior FR",
      progress: 72,
      status: "En cours",
    },
    {
      id_campaign: 2,
      name: "Sourcing Commerciaux B2B",
      profile_name: "Sales SaaS",
      progress: 45,
      status: "En cours",
    },
    {
      id_campaign: 3,
      name: "Chefs de projet Logistique",
      profile_name: "Ops Logistique",
      progress: 30,
      status: "En cours",
    },
    {
      id_campaign: 4,
      name: "Data Analysts – Paris",
      profile_name: "Data Junior",
      progress: 100,
      status: "Terminée",
    },
    {
      id_campaign: 5,
      name: "Consultants RH",
      profile_name: "RH Généraliste",
      progress: 100,
      status: "Terminée",
    },
  ];

  const campaignList =
    data.campaigns.length > 0 ? data.campaigns : mockCampaigns;

  return (
    <div className="w-full space-y-6">
      {/* 1. Header Card avec le bouton d'action principal */}
      <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
            TRAFIQ AI SOURCING AGENT
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Mes Campagnes
          </h1>
        </div>
        <button
          onClick={() => navigate("/campaigns/create")}
          className="w-full sm:w-auto bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold py-3 px-6 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer text-sm"
        >
          <span className="text-xl leading-none">+</span> Créer une campagne
        </button>
      </div>

      {/* 2. Top Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Campagnes Actives
          </p>
          <p className="text-4xl font-extrabold text-slate-900 my-2">
            {data.active_campaigns_count}
          </p>
          <p className="text-xs font-medium text-slate-400">
            En cours d'exécution
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Prospects Qualifiés
          </p>
          <p className="text-4xl font-extrabold text-slate-900 my-2">
            {data.qualified_rate_avg}%
          </p>
          <p className="text-xs font-medium text-slate-400">
            Taux de qualification moyen
          </p>
        </div>
      </div>

      {/* 3. Table / List Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Campagnes</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-150">
            <thead>
              <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="pb-3 w-2/5">Nom de la campagne</th>
                <th className="pb-3 w-1/5">Profil utilisé</th>
                <th className="pb-3 w-1/5">Progression</th>
                <th className="pb-3 w-1/6">Statut</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {campaignList.map((item) => (
                <tr
                  key={item.id_campaign}
                  className="hover:bg-slate-50 transition"
                >
                  <td className="py-4 font-bold text-slate-800 pr-4">
                    {item.name}
                  </td>
                  <td className="py-4 text-slate-600 font-medium pr-4">
                    {item.profile_name}
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-600 w-8 text-right">
                        {item.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 pr-4">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                        item.status === "En cours"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800 font-bold text-sm cursor-pointer">
                      Voir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Campaigns;