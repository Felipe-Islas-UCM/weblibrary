import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import BookCard from "../components/BookCard";
import SearchBar from "../components/SearchBar";
import TypeSelector from "../components/TypeSelector";
import type { Book } from "../types/book";
import { bookService } from "../services/book.service";

const Home = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [bookTypes, setBookTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener todos los libros y extraer los tipos únicos
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await bookService.getAllBooks();
        setBooks(data);

        // Extraer tipos únicos de los libros
        const uniqueTypes = Array.from(new Set(data.map((book) => book.type)));
        setBookTypes(uniqueTypes);

        setLoading(false);
      } catch (err) {
        setError("Error al cargar los libros");
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);

      let searchResults: Book[] = [];

      if (searchQuery.trim()) {
        // Si hay texto de búsqueda, buscar por título
        searchResults = await bookService.findBookByTitle(searchQuery);
      } else if (selectedType) {
        // Si no hay texto pero hay tipo seleccionado, filtrar por tipo
        searchResults = await bookService.getBooksByType(selectedType);
      } else {
        // Si no hay ni texto ni tipo, mostrar todos
        searchResults = await bookService.getAllBooks();
      }

      setBooks(searchResults);
      setLoading(false);
    } catch (err) {
      setError("Error al buscar los libros");
      setLoading(false);
    }
  };

  // Función para limpiar la búsqueda
  const handleClearSearch = async () => {
    setSearchQuery("");
    setSelectedType("");
    try {
      setLoading(true);
      const data = await bookService.getAllBooks();
      setBooks(data);
      setLoading(false);
    } catch (err) {
      setError("Error al cargar los libros");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-amber-800">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white w-full">
      {/* Barra de búsqueda y selector de tipos */}
      <div className="w-full bg-gradient-to-r from-amber-800/5 via-amber-700/10 to-amber-800/5">
        <div className="max-w-3xl mx-auto py-12">
          {user?.role === "ADMIN" ? (
            <div className="space-y-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Busca por título..."
              types={bookTypes}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              onSearch={handleSearch}
              onClear={handleClearSearch}
            />
            {(searchQuery || selectedType) && (
              <div className="text-sm text-gray-600">
                {searchQuery && `Buscando: "${searchQuery}" `}
                {selectedType && `en tipo: ${selectedType}`}
                <button
                  onClick={handleClearSearch}
                  className="ml-2 text-amber-600 hover:text-amber-800"
                >
                  Limpiar búsqueda
                </button>
              </div>
            )}
          </div>
          ) : (
            <TypeSelector
              types={bookTypes}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              onSearch={handleSearch}
            />
          )}
        </div>
      </div>

      {/* Colección de libros */}
      <div className="max-w-[1440px] mx-auto px-6 py-16">
      <h2 className="text-3xl font-semibold text-[#8B4513] mb-8">
          {searchQuery || selectedType ? "Resultados de la búsqueda" : "Explora Nuestra Colección"}
        </h2>
        {books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600">
            No se encontraron libros para mostrar.
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
