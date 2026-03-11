export interface Employee {
    id: string;
    name: string;
    surname: string;
    nif: string;
    email: string;
    phone?: string;
    city?: string;
    province?: string;
    country?: string;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateEmployeeInput {
    name: string;
    surname: string;
    nif: string;
    email: string;
    phone?: string;
    city?: string;
    province?: string;
    country?: string;
}