import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/booking.service';
import type { Booking } from '../types/booking';

function PrestamosView() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [prestamos, setPrestamos] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrestamos = async () => {
      try {
        // Solo intentar cargar los préstamos si la autenticación ya está lista
        if (!isAuthLoading && user?.email) {
          const data = await bookingService.findBookingsByEmail(user.email);
          setPrestamos(data);
        }
      } catch (err) {
        setError('Error al cargar los préstamos');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrestamos();
  }, [user?.email, isAuthLoading]);

  // Si la autenticación está cargando, mostrar loading
  if (isAuthLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Cargando información de usuario...</div>
      </div>
    );
  }

  const getEstadoColor = (estado: boolean) => {
    return estado 
      ? 'bg-green-100 text-green-800'  // Activo
      : 'bg-red-100 text-red-800';     // Inactivo
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Cargando préstamos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Información del usuario */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold text-gray-800">Mis Préstamos</h2>
        <p className="text-gray-600 mt-2">
          Usuario: <span className="font-medium">{user?.email}</span>
        </p>
      </div>

      {/* Tabla de préstamos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Préstamo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Devolución
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {prestamos.map((prestamo) => (
                <tr key={prestamo.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {prestamo.copiaLibro.libro.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoColor(prestamo.estado)}`}>
                      {prestamo.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(prestamo.fechaReserva).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(prestamo.fechaDevolucion).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PrestamosView;