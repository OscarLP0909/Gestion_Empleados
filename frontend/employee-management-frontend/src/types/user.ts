export interface User {
    _id: string;
    id?: string;
    name: string;
    email: string;
    role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
    isActive?: boolean;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}

export interface LoginResponse {
    access_token: string;
    user: User;
}

export interface RegisterResponse {
    access_token: string;
    user: User;
}