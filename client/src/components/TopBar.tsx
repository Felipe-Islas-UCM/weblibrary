import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TopBar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
      logout();
      navigate('/login');
    };

    // Renderizado condicional de los enlaces según el rol
    const renderNavLinks = () => {
      if (!isAuthenticated) {
        return (
          <>
            <a
              href="/"
              className="text-amber-50 hover:text-amber-200 transition-colors"
            >
              Inicio
            </a>
            <a
              href="/about"
              className="text-amber-50 hover:text-amber-200 transition-colors"
            >
              Acerca de
            </a>
            <a
              href="/login"
              className="px-4 py-2 bg-amber-700 text-white rounded-lg 
                        hover:bg-amber-800 transition-colors shadow-sm"
            >
              Iniciar Sesión
            </a>
          </>
        );
      }

      if (user?.role === 'ADMIN') {
        return (
          <>
            <a
              href="/"
              className="text-amber-50 hover:text-amber-200 transition-colors"
            >
              Inicio
            </a>
            <a
              href="/new-libro"
              className="text-amber-50 hover:text-amber-200 transition-colors"
            >
              Nuevo Libro
            </a>
            <a
              href="/new-prestamo"
              className="text-amber-50 hover:text-amber-200 transition-colors"
            >
              Préstamo
            </a>
            <a
              href="/devoluciones"
              className="text-amber-50 hover:text-amber-200 transition-colors"
            >
              Devolución
            </a>
            <a
              href="/lector"
              className="text-amber-50 hover:text-amber-200 transition-colors"
            >
              Lector
            </a>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-amber-700 text-white rounded-lg 
                        hover:bg-amber-800 transition-colors shadow-sm"
            >
              Salir
            </button>
          </>
        );
      }

      // Usuario LECTOR
      return (
        <>
          <a
            href="/"
            className="text-amber-50 hover:text-amber-200 transition-colors"
          >
            Inicio
          </a>
          <a
            href="/my-prestamos"
            className="text-amber-50 hover:text-amber-200 transition-colors"
          >
            Mis Préstamos
          </a>
          <a
            href="/my-multas"
            className="text-amber-50 hover:text-amber-200 transition-colors"
          >
            Mis Multas
          </a>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-amber-700 text-white rounded-lg 
                      hover:bg-amber-800 transition-colors shadow-sm"
          >
            Salir
          </button>
        </>
      );
    };

    return (
      <nav className="w-full bg-[#8B4513] text-white shadow-md">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <a href="/" className="flex items-center">
                <span className="text-2xl font-bold">
                  Book<span className="text-amber-200">Hub</span>
                </span>
              </a>
            </div>
  
            <div className="flex items-center space-x-6">
              {renderNavLinks()}
            </div>
          </div>
        </div>
      </nav>
    );
};
  
export default TopBar;