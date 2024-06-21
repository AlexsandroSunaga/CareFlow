export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type AuditEvent = {
  at: string;
  actor_email: string;
  action: string;
  resource: string;
};
