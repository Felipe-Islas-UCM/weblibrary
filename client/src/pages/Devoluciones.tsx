import { useState } from 'react';
import { readerService } from '../services/reader.service';
import { bookingService } from '../services/booking.service';
import type { Reader } from '../types/user';
import type { Booking } from '../types/booking';

function Devoluciones() {
  const [email, setEmail] = useState('');
  const [reader, setReader] = useState<Reader | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!email.trim()) {
      setError('Por favor, ingresa un email');
      return;
    }

    setLoading(true);
    setError(null);
    setReader(null);
    setBookings([]);
    setSelectedBookingId(null);

    try {
      const foundReader = await readerService.findReaderByEmail(email);
      setReader(foundReader);

      const readerBookings = await bookingService.findBookingsByEmail(email);
      // Filtrar solo los préstamos activos
      setBookings(readerBookings.filter(booking => booking.estado));
    } catch (err) {
      setError('No se encontró el lector con ese email');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async () => {
    if (!selectedBookingId) {
      setError('Por favor, selecciona un préstamo para devolver');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const updatedBooking = await bookingService.returnBooking(selectedBookingId, false);
      
      // Actualizar la lista de préstamos
      setBookings(prevBookings => 
        prevBookings.filter(booking => booking.id !== selectedBookingId)
      );
      setSelectedBookingId(null);
    } catch (err) {
      setError('Error al procesar la devolución');
    } finally {
      setProcessing(false);
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
      <h1 className="text-3xl font-bold mb-8">Devolución de Libros</h1>

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
          <h2 className="text-xl font-semibold mb-4">Información del Lector</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Nombre:</p>
              <p className="font-medium">{reader.nombre} {reader.apellido || ''}</p>
            </div>
            <div>
              <p className="text-gray-600">Email:</p>
              <p className="font-medium">{reader.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Préstamos Activos */}
      {reader && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Préstamos Activos</h2>
            <button
              onClick={handleReturn}
              disabled={!selectedBookingId || processing}
              className={`px-4 py-2 rounded-md text-white ${
                !selectedBookingId || processing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {processing ? 'Procesando...' : 'Procesar Devolución'}
            </button>
          </div>
          
          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map(booking => (
                <div 
                  key={booking.id}
                  onClick={() => setSelectedBookingId(booking.id)}
                  className={`border rounded-lg p-4 transition-colors cursor-pointer ${
                    selectedBookingId === booking.id
                      ? 'bg-amber-50 border-amber-500'
                      : 'hover:bg-gray-50'
                  }`}
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
              Este lector no tiene préstamos activos
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Devoluciones;