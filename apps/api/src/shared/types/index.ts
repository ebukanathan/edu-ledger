// Cross-cutting types shared across modules (pagination, ids, etc.).
export type ID = string;

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
