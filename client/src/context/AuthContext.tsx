import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

// Interfaces
interface User {
  email: string;
  role: "ADMIN" | "LECTOR";
}

interface DecodedToken {
  sub: string;
  rol: "ADMIN" | "LECTOR";
  iat: number;
  exp: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Función para decodificar y validar el token
const parseToken = (token: string): User | null => {
    console.log('Token recibido en parseToken:', token);
    console.log('Tipo de token:', typeof token);
    
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      console.log('Token decodificado:', decoded);
      
      // Verificar si el token ha expirado
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("accessToken");
        console.log("token expirado");
        return null;
      }
      return {
        email: decoded.sub,
        role: decoded.rol
      };
    } catch (error) {
      console.error("Error detallado al decodificar el token:", error);
      return null;
    }
  };

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Efecto para inicializar la autenticación
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const userData = parseToken(token);
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (token: string) => {
    console.log('Token recibido en login:', token);
    console.log('Tipo de token en login:', typeof token);
    
    const userData = parseToken(token);
    if (userData) {
      localStorage.setItem("accessToken", token);
      setUser(userData);
      setIsAuthenticated(true);
    } else {
      throw new Error("Token inválido");
    }
};

  const logout = () => {
    console.log("logout");
    localStorage.removeItem("accessToken");
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider");
  }
  return context;
};