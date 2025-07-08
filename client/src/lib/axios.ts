import axios from "axios";

const baseURL = 'http://localhost:8087/api/';

// Lista de rutas públicas que no necesitan token
const publicRoutes = ['/book/all', '/book/all/'];

const axiosInstance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

// Interceptor para agregar el token a las peticiones
axiosInstance.interceptors.request.use(
    (config) => {
      // Verificar si la ruta es pública
      const isPublicRoute = publicRoutes.some(route => 
        config.url?.startsWith(route)
      );

      // Si no es ruta pública, agregar el token
      if (!isPublicRoute) {
        const token = localStorage.getItem("accessToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);

// Interceptor para manejar errores de autenticación
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      // Solo redirigir al login si es un error de token inválido durante la carga inicial
      if (error.response?.status === 401 && window.location.pathname !== '/login') {
        const token = localStorage.getItem("accessToken");
        // Solo redirigir si hay un token almacenado (significa que la sesión expiró)
        if (token) {
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
);

export default axiosInstance;