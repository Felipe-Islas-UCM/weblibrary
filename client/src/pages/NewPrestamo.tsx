import { useState, useEffect } from 'react';
import { bookService } from '../services/book.service';
import { bookingService } from '../services/booking.service';
import { readerService } from '../services/reader.service';
import type { Book, BookCopy } from '../types/book';
import type { Reader } from '../types/user';


function NewPrestamo() {
  // Estados
  const [email, setEmail] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [copiaSeleccionada, setCopiaSeleccionada] = useState<number | null>(null);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [copiasDisponibles, setCopiasDisponibles] = useState<BookCopy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [reader, setReader] = useState<Reader | null>(null);
  const [loadingReader, setLoadingReader] = useState(false);
  const [readerError, setReaderError] = useState<string | null>(null);

  // Cargar todos los libros al montar el componente
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const books = await bookService.getAllBooks();
        setAllBooks(books);
      } catch (err) {
        setError('Error al cargar los libros');
      }
    };
    fetchBooks();
  }, []);

  // Función para buscar lector por email
  const handleBuscarLector = async (emailToSearch: string) => {
    if (!emailToSearch.trim()) return;

    setLoadingReader(true);
    setReaderError(null);
    setReader(null);

    try {
      const foundReader = await readerService.findReaderByEmail(emailToSearch);
      setReader(foundReader);
      setReaderError(null);
    } catch (err) {
      setReaderError('No se encontró un lector con ese email');
      setReader(null);
    } finally {
      setLoadingReader(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setReader(null);
    setReaderError(null);
  };


  // Buscar copias de libro cuando se ingresa un título
  const handleBuscarCopias = async () => {
    if (!busqueda.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const copias = await bookService.getBookCopiesByTitle(busqueda);
      setCopiasDisponibles(copias);
    } catch (err) {
      setError('Error al buscar copias del libro');
      setCopiasDisponibles([]);
    } finally {
      setLoading(false);
    }
  };

  // Manejador para crear préstamo
  const handleCrearPrestamo = async () => {
    if (!email.trim()) {
      setError('Por favor, ingresa el email del usuario');
      return;
    }
    if (!reader) {
      setError('Por favor, verifica el email del usuario');
      return;
    }
    if (!copiaSeleccionada) {
      setError('Por favor, selecciona un libro para el préstamo');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await bookingService.createBooking({
        usuario: {
          id: reader.id // Ahora usamos el ID del lector encontrado
        },
        copiaLibro: {
          id: copiaSeleccionada
        }
      });

      // Limpiar formulario después de éxito
      setEmail('');
      setReader(null);
      setBusqueda('');
      setCopiaSeleccionada(null);
      setCopiasDisponibles([]);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Error al crear el préstamo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Formulario de Préstamo (2/3 del espacio) */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-8">Nuevo Préstamo</h1>
          
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            {/* Mensajes de estado */}
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                Préstamo creado exitosamente
              </div>
            )}

            {/* Campo de Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email del Usuario
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="usuario@ejemplo.com"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                  required
                />
                <button
                  onClick={() => handleBuscarLector(email)}
                  disabled={!email.trim() || loadingReader}
                  className={`px-4 py-2 rounded-md ${
                    !email.trim() || loadingReader
                      ? 'bg-gray-300 text-gray-500'
                      : 'bg-amber-600 text-white hover:bg-amber-700'
                  }`}
                >
                  {loadingReader ? 'Buscando...' : 'Verificar'}
                </button>
              </div>
              {/* Información del lector */}
              {readerError && (
                <p className="mt-2 text-sm text-red-600">{readerError}</p>
              )}
              {reader && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm text-green-800">
                    Lector encontrado: {reader.nombre} ({reader.email})
                  </p>
                </div>
              )}
            </div>

            {/* Búsqueda de Libros */}
            <div>
              <label htmlFor="busqueda" className="block text-sm font-medium text-gray-700 mb-2">
                Buscar Libro
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="busqueda"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Ingresa el título exacto del libro..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                />
                <button
                  onClick={handleBuscarCopias}
                  className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
                  disabled={!busqueda.trim() || loading}
                >
                  Buscar
                </button>
              </div>
            </div>

            {/* Lista de Copias Disponibles */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">
                Copias Disponibles
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {loading ? (
                  <p className="text-center text-gray-500 py-4">Cargando...</p>
                ) : copiasDisponibles.length > 0 ? (
                  copiasDisponibles.map(copia => (
                    <div 
                      key={copia.id}
                      className={`flex items-center space-x-4 p-4 border rounded-md hover:bg-gray-50 ${
                        !copia.estado ? 'opacity-50' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="copiaSeleccionada"
                        value={copia.id}
                        checked={copiaSeleccionada === copia.id}
                        onChange={() => setCopiaSeleccionada(copia.id)}
                        disabled={!copia.estado}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                      />
                      <div>
                        <h4 className="font-medium">{copia.libro.title}</h4>
                        <p className="text-sm text-gray-600">
                          {copia.libro.author} - {copia.libro.type}
                        </p>
                      </div>
                      <span className={`ml-auto px-2 py-1 text-xs font-semibold rounded-full ${
                        copia.estado 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {copia.estado ? 'Disponible' : 'No Disponible'}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    No se encontraron copias disponibles
                  </p>
                )}
              </div>
            </div>

            {/* Botón de Crear Préstamo */}
            <button
              onClick={handleCrearPrestamo}
              disabled={!reader || !copiaSeleccionada || loading}
              className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                reader && copiaSeleccionada && !loading
                  ? 'bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? 'Creando préstamo...' : 'Crear Préstamo'}
            </button>
          </div>
        </div>

        {/* Lista de Libros Disponibles (1/3 del espacio) */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Libros Disponibles</h2>
          <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
            {allBooks.map(book => (
              <div 
                key={book.id}
                className="p-3 border rounded hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setBusqueda(book.title);
                  handleBuscarCopias();
                }}
              >
                <h3 className="font-medium">{book.title}</h3>
                <p className="text-sm text-gray-600">{book.author}</p>
                <p className="text-xs text-gray-500">{book.type}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewPrestamo;