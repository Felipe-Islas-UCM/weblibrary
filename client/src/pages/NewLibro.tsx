import { useState, useRef, useEffect } from 'react';
import { tiposLibro } from '../data/mockData';
import type { Book, NewBookRequest, NewCopyRequest } from '../types/book';
import { bookService } from '../services/book.service';

function NewLibro() {
  // Estado para el formulario de nuevo libro
  const [nuevoLibro, setNuevoLibro] = useState({
    title: '',
    author: '',
    type: '',
    image64: ''
  });

  // Estado para la sección de copias
  const [busqueda, setBusqueda] = useState('');
  const [libroSeleccionado, setLibroSeleccionado] = useState<number | null>(null);
  const [libros, setLibros] = useState<Book[]>([]);
  const [loadingCopy, setLoadingCopy] = useState(false);
  const [errorCopy, setErrorCopy] = useState<string | null>(null);
  const [successCopy, setSuccessCopy] = useState(false);
  
  // Estados para manejar la UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Referencia para el input de archivo
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar libros al montar el componente
  useEffect(() => {
    const fetchLibros = async () => {
      try {
        const data = await bookService.getAllBooks();
        setLibros(data);
      } catch (err) {
        setErrorCopy('Error al cargar los libros');
      }
    };

    fetchLibros();
  }, []);

  

  // Manejador para la carga de imágenes
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        setError('Por favor, selecciona una imagen en formato JPG o PNG');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setNuevoLibro(prev => ({
          ...prev,
          image64: reader.result as string
        }));
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Manejador para crear nuevo libro
  const handleCrearLibro = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validar que todos los campos requeridos estén completos
      if (!nuevoLibro.title || !nuevoLibro.author || !nuevoLibro.type) {
        throw new Error('Por favor, completa todos los campos requeridos');
      }

      // Crear el libro usando el servicio
      const bookData: NewBookRequest = {
        title: nuevoLibro.title,
        author: nuevoLibro.author,
        type: nuevoLibro.type,
        image64: nuevoLibro.image64
      };

      await bookService.createNewBook(bookData);

      // Limpiar el formulario después de crear exitosamente
      setNuevoLibro({
        title: '',
        author: '',
        type: '',
        image64: ''
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000); // Ocultar mensaje de éxito después de 3 segundos
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el libro');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar libros según la búsqueda
  const librosFiltrados = libros.filter(libro => 
    libro.title.toLowerCase().includes(busqueda.toLowerCase()) ||
    libro.author.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Manejador para crear copia
  const handleCrearCopia = async () => {
    if (!libroSeleccionado) {
      setErrorCopy('Por favor, selecciona un libro para crear una copia');
      return;
    }

    setLoadingCopy(true);
    setErrorCopy(null);
    setSuccessCopy(false);

    try {
      const copyData: NewCopyRequest = {
        estado: true,
        libro: {
          id: libroSeleccionado
        }
      };

      await bookService.createNewCopy(copyData);
      
      // Limpiar selección y mostrar mensaje de éxito
      setLibroSeleccionado(null);
      setSuccessCopy(true);
      setTimeout(() => setSuccessCopy(false), 3000);

      // Recargar la lista de libros para actualizar cantidades
      const updatedBooks = await bookService.getAllBooks();
      setLibros(updatedBooks);
    } catch (err) {
      setErrorCopy(err instanceof Error ? err.message : 'Error al crear la copia');
    } finally {
      setLoadingCopy(false);
    }
  };
  

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gestión de Libros y Copias</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulario Nuevo Libro */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">Nuevo Libro</h2>

          {/* Mensajes de estado */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              Libro creado exitosamente
            </div>
          )}

          <form onSubmit={handleCrearLibro} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                value={nuevoLibro.title}
                onChange={e => setNuevoLibro(prev => ({...prev, title: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Autor
              </label>
              <input
                type="text"
                value={nuevoLibro.author}
                onChange={e => setNuevoLibro(prev => ({...prev, author: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                value={nuevoLibro.type}
                onChange={e => setNuevoLibro(prev => ({...prev, type: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                required
              >
                <option value="">Selecciona un tipo</option>
                {tiposLibro.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagen
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={nuevoLibro.image64 ? 'Imagen seleccionada' : ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  readOnly
                  placeholder="Ninguna imagen seleccionada"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Examinar
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500'
              }`}
            >
              {loading ? 'Creando...' : 'Crear Libro'}
            </button>
          </form>
        </div>

        {/* Sección de Copias */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6">Nueva Copia</h2>

        {/* Mensajes de estado para copias */}
        {errorCopy && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errorCopy}
          </div>
        )}
        {successCopy && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            Copia creada exitosamente
          </div>
        )}
        
        {/* Barra de búsqueda */}
        <div className="mb-6">
          <input
            type="text"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar libro por título o autor..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
          />
        </div>

        {/* Lista de libros */}
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
          {librosFiltrados.length > 0 ? (
            librosFiltrados.map(libro => (
              <div 
                key={libro.id}
                className={`flex items-center space-x-4 p-4 border rounded-md hover:bg-gray-50 cursor-pointer ${
                  libroSeleccionado === libro.id ? 'bg-amber-50 border-amber-300' : ''
                }`}
                onClick={() => setLibroSeleccionado(libro.id)}
              >
                <input
                  type="radio"
                  name="libroSeleccionado"
                  checked={libroSeleccionado === libro.id}
                  onChange={() => setLibroSeleccionado(libro.id)}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <h3 className="font-medium">{libro.title}</h3>
                  <p className="text-sm text-gray-600">
                    {libro.author} - {libro.type}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              No se encontraron libros
            </div>
          )}
        </div>

        <button
          onClick={handleCrearCopia}
          disabled={!libroSeleccionado || loadingCopy}
          className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            !libroSeleccionado || loadingCopy
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500'
          }`}
        >
          {loadingCopy ? 'Creando copia...' : 'Crear Copia'}
        </button>
      </div>
      </div>
    </div>
  );
}

export default NewLibro;