export const defaultPageSize = 12;

export type PageInput = {
  page?: string;
  pageSize?: number;
};

export type PaginatedResult<T> = {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export function normalizePage(input?: PageInput) {
  const page = Math.max(1, Number(input?.page ?? 1) || 1);
  const pageSize = Math.max(1, Math.min(50, input?.pageSize ?? defaultPageSize));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  return { page, pageSize, from, to };
}

export function sanitizeSearch(value?: string) {
  return (value ?? "")
    .trim()
    .replace(/[,%()]/g, " ")
    .replace(/\s+/g, " ")
    .slice(0, 80);
}

export function paginated<T>({
  data,
  page,
  pageSize,
  total,
}: {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}): PaginatedResult<T> {
  return {
    data,
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}
