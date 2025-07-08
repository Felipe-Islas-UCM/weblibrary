import type { Book } from "../types/book";  
  interface BookCardProps {
    book: Book;
  }
  
  const BookCard = ({ book }: BookCardProps) => {
    return (
      <div
        className="bg-white rounded-lg shadow-md overflow-hidden 
                        hover:shadow-lg transition-shadow border border-amber-100"
      >
        <div className="aspect-[3/4] relative overflow-hidden">
          <img
            src={`${book.image64}`}
            alt={book.title}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-800 mb-1">
            {book.title}
          </h3>
          <p className="text-sm text-gray-600 mb-2">por {book.author}</p>
          <span
            className="inline-block px-2 py-1 text-xs bg-amber-50 
                           text-amber-800 rounded-full border border-amber-200"
          >
            {book.type}
          </span>
        </div>
      </div>
    );
  };
  
  export default BookCard;
  