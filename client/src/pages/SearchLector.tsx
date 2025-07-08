import { useState } from 'react';
import { readerService } from '../services/reader.service';
import { bookingService } from '../services/booking.service';
import type { Reader } from '../types/user';
import type { Booking } from '../types/booking';

function SearchLector() {
  const [email, setEmail] = useState('');
  const [reader, setReader] = useState<Reader | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const handleSearch = async () => {
    if (!email.trim()) {
      setError('Por favor, ingresa un email');
      return;
    }

    setLoading(true);
    setError(null);
    setReader(null);
    setBookings([]);

    try {
      // Primero buscamos el lector
      const foundReader = await readerService.findReaderByEmail(email);
      setReader(foundReader);

      // Si encontramos el lector, buscamos sus préstamos
      const readerBookings = await bookingService.findBookingsByEmail(email);
      setBookings(readerBookings);
    } catch (err) {
      setError('No se encontró el lector con ese email');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateState = async () => {
    if (!reader) return;

    setUpdating(true);
    try {
      // Enviamos el estado contrario al actual
      console.log(reader.email);
      console.log(!reader.estado);
      console.log(typeof !reader.estado);
      const updatedReader = await readerService.updateReaderState(reader.email, String(!reader.estado));
      setReader(updatedReader);
    } catch (err) {
      setError('Error al actualizar el estado del lector');
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Búsqueda de Lector</h1>

      {/* Buscador */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingresa el email del lector..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className={`px-6 py-2 rounded-md ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-700 text-white'
            }`}
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>

      {/* Información del Lector */}
      {reader && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold">Información del Lector</h2>
            <button
              onClick={handleUpdateState}
              disabled={updating}
              className={`px-4 py-2 rounded-md text-white ${
                updating
                  ? 'bg-gray-400 cursor-not-allowed'
                  : reader.estado
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-green-600 hover:bg-green-700' 
              }`}
            >
              {updating
                ? 'Actualizando...'
                : reader.estado
                  ? 'Bloquear Usuario'
                  : 'Desbloquear Usuario'}
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Nombre:</p>
              <p className="font-medium">{reader.nombre} {reader.apellido || ''}</p>
            </div>
            <div>
              <p className="text-gray-600">Email:</p>
              <p className="font-medium">{reader.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Estado:</p>
              <div className="flex items-center gap-2">
                <span className={`inline-block w-2 h-2 rounded-full ${
                  reader.estado ? 'bg-green-500' : 'bg-red-500'
                }`}></span>
                <p className={`font-medium ${
                  reader.estado ? 'text-green-600' : 'text-red-600'
                }`}>
                  {reader.estado ? 'Activo' : 'Inactivo'}
                </p>
              </div>
            </div>
            <div>
              <p className="text-gray-600">Rol:</p>
              <p className="font-medium">{reader.rol.nombre}</p>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Préstamos */}
      {reader && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Préstamos del Lector</h2>
          
          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map(booking => (
                <div 
                  key={booking.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-lg">
                        {booking.copiaLibro.libro.title}
                      </h3>
                      <p className="text-gray-600">
                        {booking.copiaLibro.libro.author}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      booking.estado
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {booking.estado ? 'Activo' : 'Finalizado'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                    <div>
                      <p className="text-gray-600">Fecha de Reserva:</p>
                      <p>{formatDate(booking.fechaReserva)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Fecha de Devolución:</p>
                      <p>{formatDate(booking.fechaDevolucion)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">
              Este lector no tiene préstamos registrados
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchLector;