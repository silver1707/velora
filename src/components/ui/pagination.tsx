import Link from "next/link";
import { cn } from "@/lib/utils";

type PaginationProps = {
  basePath: string;
  page: number;
  totalPages: number;
  total: number;
  params?: Record<string, string | undefined>;
};

function pageHref(
  basePath: string,
  params: Record<string, string | undefined>,
  page: number,
) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value && key !== "page") {
      search.set(key, value);
    }
  });

  if (page > 1) {
    search.set("page", String(page));
  }

  const query = search.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function Pagination({
  basePath,
  page,
  totalPages,
  total,
  params = {},
}: PaginationProps) {
  if (totalPages <= 1) {
    return (
      <p className="mt-5 text-sm text-muted">
        {total} registro{total === 1 ? "" : "s"} encontrado{total === 1 ? "" : "s"}.
      </p>
    );
  }

  const itemClassName =
    "inline-flex h-10 items-center justify-center rounded-lg border px-3 text-sm font-medium transition";

  return (
    <nav
      className="toolbar-panel mt-6 flex flex-col gap-3 rounded-lg p-3 sm:flex-row sm:items-center sm:justify-between"
      aria-label="Paginação"
    >
      <p className="text-sm text-muted">
        Página <strong className="text-foreground">{page}</strong> de{" "}
        <strong className="text-foreground">{totalPages}</strong> • {total} registros
      </p>
      <div className="flex items-center gap-2">
        {page > 1 ? (
          <Link
            href={pageHref(basePath, params, page - 1)}
            className={cn(itemClassName, "border-border/80 bg-surface-raised/80 text-foreground")}
          >
            Anterior
          </Link>
        ) : (
          <span className={cn(itemClassName, "border-border-soft/60 text-muted-strong")}>
            Anterior
          </span>
        )}
        {page < totalPages ? (
          <Link
            href={pageHref(basePath, params, page + 1)}
            className={cn(itemClassName, "border-lilac/35 bg-lilac/12 text-lilac")}
          >
            Próxima
          </Link>
        ) : (
          <span className={cn(itemClassName, "border-border-soft/60 text-muted-strong")}>
            Próxima
          </span>
        )}
      </div>
    </nav>
  );
}
