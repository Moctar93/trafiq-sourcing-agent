import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api", // Adresse du backend Django
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
  (config) => {
    // Vérification de 'token' (ou 'access_token' en fallback)
    const token = localStorage.getItem("token") || localStorage.getItem("access_token");
    if (token) {
      // Utilisation du format JWT officiel : Bearer <token>
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Intercepteur pour gérer l'expiration du token (erreur 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Si le token est expiré ou invalide, on nettoie le storage et on redirige vers /login
      localStorage.removeItem("token");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;