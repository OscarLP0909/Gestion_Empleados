export interface Contract {
    id: string;
    employeeId: string;
    status: "PENDIENTE" | "APROBADO" | "ACTIVO" | "RECHAZADO" | "FINALIZADO";
    contractType: "Indefinido" | "Prácticas" | "Formación" | "Eventual";
    temporaryType?: string;
    workdayType: "Completa" | "Parcial";
    salaryType: "Bruto" | "Neto";
    salaryAmount: number;
    startDate: Date;
    endDate?: Date;
    department: string;
    category: string;
    position: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateContractInput {
    employeeId: string;
    contractType: "Indefinido" | "Prácticas" | "Formación" | "Eventual";
    temporaryType?: string;
    workdayType: "Completa" | "Parcial";
    salaryType: "Bruto" | "Neto";
    salaryAmount: number;
    startDate: string;
    endDate?: string;
    department: string;
    category: string;
    position: string;
    status: "PENDIENTE" | "APROBADO" | "ACTIVO" | "RECHAZADO" | "FINALIZADO";
}