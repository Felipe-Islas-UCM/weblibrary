import axiosInstance from '../lib/axios';
import type { NewBookingRequest } from '../types/book';
import type { Booking } from '../types/booking';

export const bookingService = {
    // Crear nuevo préstamo
    async createBooking(bookingData: NewBookingRequest): Promise<void> {
        await axiosInstance.post('/booking/new', bookingData);
    },

    async findBookingsByEmail(email: string): Promise<Booking[]> {
        const encodedEmail = encodeURIComponent(email);
        const response = await axiosInstance.get<Booking[]>(`/booking/find/${encodedEmail}`);
        return response.data;
    },

     // Método para devolver un préstamo
     async returnBooking(bookingId: number, estado: boolean): Promise<Booking> {
        const response = await axiosInstance.post<Booking>(
            `/booking/return/${bookingId}`,
            { estado }
        );
        return response.data;
    }
};