export interface User {
    _id: string;
    id?: string;
    name: string;
    email: string;
    role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}