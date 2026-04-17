export type ContractStatus = 'PENDIENTE' | 'APROBADO' | 'ACTIVO' | 'RECHAZADO' | 'FINALIZADO';
export type ContractType = 'Indefinido' | 'Prácticas' | 'Formación' | 'Eventual';
export type WorkdayType = 'Completa' | 'Parcial';
export type SalaryType = 'Bruto' | 'Neto';

export interface Contract {
  _id?: string;
  id?: string;
  employeeId: string;
  employee?: { name: string; surname: string; nif: string; email?: string };
  // populated field from backend
  employeeData?: { _id?: string; name: string; surname: string; nif: string; email?: string };
  status: ContractStatus;
  contractType: ContractType;
  temporaryType?: string;
  workdayType: WorkdayType;
  salaryType: SalaryType;
  salaryAmount: number;
  startDate: string | Date;
  endDate?: string | Date;
  department: string;
  category: string;
  position: string;
  createdAt?: Date;
  updatedAt?: Date;
}
