import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fineService } from '../services/fine.service';
import type { Fine } from '../types/booking';

function MultasView() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [multas, setMultas] = useState<Fine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para formatear el monto en pesos chilenos
  const formatMonto = (monto: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(monto);
  };

  useEffect(() => {
    const fetchMultas = async () => {
      try {
        if (!isAuthLoading && user?.email) {
          const data = await fineService.findFinesByEmail(user.email);
          setMultas(data);
        }
      } catch (err) {
        setError('Error al cargar las multas');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMultas();
  }, [user?.email, isAuthLoading]);

  // Calcular el total de multas activas
  const totalMultasActivas = multas
    .filter(multa => multa.estado)
    .reduce((acc, multa) => acc + multa.monto, 0);

  if (isAuthLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Cargando información de usuario...</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Cargando multas...</div>
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
      {/* Información del usuario y resumen */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold text-gray-800">Mis Multas</h2>
        <p className="text-gray-600 mt-2">
          Usuario: <span className="font-medium">{user?.email}</span>
        </p>
        <div className="mt-4 p-4 bg-red-50 rounded-md">
          <p className="text-red-700">
            Total multas activas: <span className="font-bold">{formatMonto(totalMultasActivas)}</span>
          </p>
        </div>
      </div>

      {/* Tabla de multas */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {multas.map((multa) => (
                <tr key={multa.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{multa.descripcion}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatMonto(multa.monto)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      multa.estado 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {multa.estado ? 'Activa' : 'Pagada'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mensaje cuando no hay multas */}
      {multas.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No tienes multas registradas
        </div>
      )}
    </div>
  );
}

export default MultasView;