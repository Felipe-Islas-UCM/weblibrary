export interface Book {
    id: number;
    author: string;
    title: string;
    type: string;
    image64: string;
}

export interface BookCopy {
    id: number;
    estado: boolean;
    libro: Book;
}

export interface NewBookRequest {
    title: string;
    author: string;
    type: string;
    image64: string;
}

export interface NewCopyRequest {
    estado: boolean;
    libro: {
        id: number;
    };
}

export interface NewBookingRequest {
    usuario: {
        id: number;
    };
    copiaLibro: {
        id: number;
    };
}
