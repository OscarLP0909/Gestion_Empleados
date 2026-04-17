export interface AuditLog {
  _id?: string;
  userId: string;
  userName: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE' | 'ROLE_CHANGE';
  entityType: 'EMPLOYEE' | 'CONTRACT' | 'USER';
  entityId: string;
  entityName: string;
  changes?: { before: any; after: any };
  ipAddress: string;
  description: string;
  createdAt: Date;
}

export interface AuditLogResponse {
  logs: AuditLog[];
  total: number;
  page: number;
  pages: number;
}
