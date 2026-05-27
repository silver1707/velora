import { PackagePlus, Search, SlidersHorizontal } from "lucide-react";
import { ProductForm } from "@/components/forms/product-form";
import { QuickActionForm } from "@/components/forms/quick-action-form";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input, Select } from "@/components/ui/field";
import { Pagination } from "@/components/ui/pagination";
import { Sheet } from "@/components/ui/sheet";
import { currency } from "@/lib/utils";
import { deleteProductAction } from "@/server/actions/products";
import { getProductsPage } from "@/server/queries";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ busca?: string; baixo?: string; page?: string }>;
}) {
  const params = await searchParams;
  const productsPage = await getProductsPage({
    search: params.busca,
    low: params.baixo,
    page: params.page,
  });
  const products = productsPage.data;

  return (
    <>
      <PageHeader
        eyebrow="Estoque"
        title="Produtos"
        description="Controle produtos usados nos serviços e acompanhe alertas de estoque baixo."
        action={
          <Sheet
            title="Novo produto"
            description="Cadastre marca, categoria, custo e alerta de estoque."
            trigger={
              <Button>
                <PackagePlus size={16} />
                Novo produto
              </Button>
            }
          >
            <ProductForm />
          </Sheet>
        }
      />

      <form className="toolbar-panel mb-5 grid gap-3 rounded-lg p-3 md:grid-cols-[1fr_180px_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-3 text-muted" size={17} />
          <Input
            name="busca"
            defaultValue={params.busca ?? ""}
            placeholder="Buscar por nome, marca ou categoria"
            className="pl-10"
          />
        </div>
        <Select name="baixo" defaultValue={params.baixo ?? ""}>
          <option value="">Todos</option>
          <option value="true">Estoque baixo</option>
        </Select>
        <Button type="submit" variant="secondary">
          <SlidersHorizontal size={16} />
          Filtrar
        </Button>
      </form>

      {products.length ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => {
            const low =
              product.is_running_low ||
              Number(product.stock_quantity) <= Number(product.low_stock_threshold);
            return (
              <article key={product.id} className="premium-panel rounded-lg p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {product.name}
                    </h2>
                    <p className="mt-1 text-sm text-muted">
                      {product.brand || "Sem marca"} • {product.category || "Sem categoria"}
                    </p>
                  </div>
                  {low ? (
                    <Badge className="border-gold/30 bg-gold/10 text-gold">
                      Acabando
                    </Badge>
                  ) : null}
                </div>

                <dl className="mt-5 grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <dt className="text-muted">Estoque</dt>
                    <dd className="mt-1 text-foreground">{product.stock_quantity}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Mínimo</dt>
                    <dd className="mt-1 text-foreground">{product.low_stock_threshold}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Custo</dt>
                    <dd className="mt-1 text-foreground">{currency(product.cost)}</dd>
                  </div>
                </dl>

                {product.notes ? (
                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted">
                    {product.notes}
                  </p>
                ) : null}

                <div className="mt-5 flex flex-wrap gap-2">
                  <Sheet
                    title={`Editar ${product.name}`}
                    trigger={<Button variant="secondary">Editar</Button>}
                  >
                    <ProductForm product={product} />
                  </Sheet>
                  <div className="min-w-36">
                    <QuickActionForm
                      action={deleteProductAction}
                      fields={{ id: product.id }}
                      label="Excluir"
                      variant="danger"
                      confirmMessage="Excluir este produto?"
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <EmptyState
          title="Nenhum produto encontrado"
          description="Cadastre produtos para relacionar aos serviços e acompanhar estoque."
        />
      )}
      <Pagination
        basePath="/produtos"
        page={productsPage.page}
        totalPages={productsPage.totalPages}
        total={productsPage.total}
        params={{ busca: params.busca, baixo: params.baixo }}
      />
    </>
  );
}
