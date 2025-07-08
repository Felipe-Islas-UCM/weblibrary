import type { Reader } from './user';
import type { BookCopy } from './book';

export interface Booking {
    id: number;
    fechaReserva: string;
    fechaDevolucion: string;
    estado: boolean;
    usuario: Reader;
    copiaLibro: BookCopy;
}

export interface Fine {
    id: number;
    monto: number;
    descripcion: string;
    estado: boolean;
    usuario: {
        usuario_id: number;
    }
}