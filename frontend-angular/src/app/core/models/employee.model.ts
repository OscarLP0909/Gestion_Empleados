export interface Employee {
  _id?: string;
  id?: string;
  name: string;
  surname: string;
  nif: string;
  email: string;
  phone?: string;
  city?: string;
  province?: string;
  country?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
