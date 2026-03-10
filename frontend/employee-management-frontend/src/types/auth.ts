export interface User {
    _id: string;
    email: string;
    role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
    name?: string;  
}

export interface LoginResponse {
    _id: string;
    email: string;
    role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
    token: string;
    name?: string;  
}