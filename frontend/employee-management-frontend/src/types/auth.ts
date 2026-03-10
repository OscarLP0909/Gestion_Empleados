export interface User {
    _id: string;
    email: string;
    role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
}

export interface LoginResponse {
    _id: string;
    email: string;
    role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
    token: string;
}