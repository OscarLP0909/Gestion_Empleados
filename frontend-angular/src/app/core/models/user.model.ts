export type UserRole = 'ADMIN' | 'HR_MANAGER' | 'MANAGER' | 'EMPLOYEE';

export interface User {
  _id?: string;
  id?: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  name?: string;
}

export interface AuthUser extends User {
  token?: string;
}
