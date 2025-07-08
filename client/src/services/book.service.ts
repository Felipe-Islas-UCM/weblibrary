import axiosInstance from '../lib/axios';
import type { Book, NewBookRequest, NewCopyRequest, BookCopy } from '../types/book';

export const bookService = {
    // Obtener todos los libros
    async getAllBooks(): Promise<Book[]> {
        const response = await axiosInstance.get<Book[]>('/book/all');
        return response.data;
    },

    // Obtener libros por tipo
    async getBooksByType(type: string): Promise<Book[]> {
        const response = await axiosInstance.get<Book[]>(`/book/all/${type}`);
        return response.data;
    },

    async createNewBook(bookData: NewBookRequest): Promise<Book> {
        const response = await axiosInstance.post<Book>(
            '/book/new',
            bookData
        );
        return response.data;
    },

    async findBookByTitle(title: string): Promise<Book[]> {
        console.log('Buscando título:', title);
        const response = await axiosInstance.get<Book[]>(`/book/find/${title}`);
        console.log('Resultados de la búsqueda:', response.data);
        return response.data;
    },

    async createNewCopy(copyData: NewCopyRequest): Promise<void> {
        await axiosInstance.post('/book/newcopy', copyData);
    },

    async getBookCopiesByTitle(title: string): Promise<BookCopy[]> {
        const encodedTitle = encodeURIComponent(title);
        const response = await axiosInstance.get<BookCopy[]>(`/book/copy/${encodedTitle}`);
        return response.data;
    }
};