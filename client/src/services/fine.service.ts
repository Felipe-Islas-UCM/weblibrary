import axiosInstance from '../lib/axios';
import type { Fine } from '../types/booking';

export const fineService = {
    async findFinesByEmail(email: string): Promise<Fine[]> {
        const encodedEmail = encodeURIComponent(email);
        const response = await axiosInstance.get<Fine[]>(`/fine/find/${encodedEmail}`);
        return response.data;
    }
};