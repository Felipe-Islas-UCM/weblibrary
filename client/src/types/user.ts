export interface User {
    id: number;
    nombre: string;
    apellido: string;
    rol: 'ADMIN' | 'LECTOR';
    email: string;
}

export interface UserRegistrationData {
    nombre: string;
    apellido?: string;
    email: string;
    password: string;
  }

  export interface Role {
    id: number;
    nombre: string;
}

export interface Reader {
    id: number;
    email: string;
    nombre: string;
    apellido: string | null;
    password: string;
    estado: boolean;
    rol: Role;
}