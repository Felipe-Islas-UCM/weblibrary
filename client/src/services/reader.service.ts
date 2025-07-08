import axiosInstance from "../lib/axios";
import type { Reader } from "../types/user";

export const readerService = {
  async findReaderByEmail(email: string): Promise<Reader> {
    console.log(email);
    const response = await axiosInstance.get<Reader>(
      `/reader/find/${email}`
    );
    return response.data;
  },

  // Método para actualizar el estado de un lector
  async updateReaderState(email: string, estado: string): Promise<Reader> {
    try {
      
      const response = await axiosInstance.post<Reader>(
        `/reader/state/${email}`,
        estado,  // Enviamos el string "true" o "false"
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      throw error;
    }
  },
};
