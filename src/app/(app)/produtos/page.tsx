import { PackagePlus, Search, SlidersHorizontal, Trash2, Plus as PlusIcon, Minus as MinusIcon } from "lucide-react";
import Form from "next/form";
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
import { deleteProductAction, quickUpdateStockAction } from "@/server/actions/products";
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

      <Form action="/produtos" className="premium-panel mb-8 grid gap-4 rounded-2xl p-4 md:grid-cols-[1fr_180px_auto] items-center shadow-lg">
        <div className="relative group">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted transition-colors group-focus-within:text-lilac" size={18} />
          <Input
            name="busca"
            defaultValue={params.busca ?? ""}
            placeholder="Buscar por nome, marca ou categoria"
            className="pl-11"
          />
        </div>
        <Select name="baixo" defaultValue={params.baixo ?? ""}>
          <option value="">Todos</option>
          <option value="true">Estoque baixo</option>
        </Select>
        <Button type="submit" variant="primary" className="h-12">
          <SlidersHorizontal size={16} />
          Filtrar
        </Button>
      </Form>

      {products.length ? (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => {
            const low =
              product.is_running_low ||
              Number(product.stock_quantity) <= Number(product.low_stock_threshold);
            
            const cardClasses = low
              ? "border-danger/30 shadow-[0_0_20px_-10px_var(--danger)] hover:border-danger/60"
              : "hover:border-lilac/40 hover:shadow-[0_0_30px_-15px_var(--lilac)]";

            return (
              <article key={product.id} className={`premium-panel group rounded-2xl p-6 transition-all duration-300 ${cardClasses}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      {product.name}
                    </h2>
                    <p className="mt-1 text-sm text-muted font-medium">
                      {product.brand || "Sem marca"} • {product.category || "Sem categoria"}
                    </p>
                  </div>
                  {low ? (
                    <Badge className="border-danger/30 bg-danger/10 text-danger animate-pulse">
                      Acabando
                    </Badge>
                  ) : null}
                </div>

                <div className="mt-6 flex items-center justify-between rounded-xl border border-border-soft bg-background/30 p-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted mb-1">Estoque Atual</p>
                    <p className={`text-2xl font-bold ${low ? "text-danger" : "text-foreground"}`}>
                      {product.stock_quantity} <span className="text-sm font-medium text-muted">un</span>
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <QuickActionForm
                      action={quickUpdateStockAction}
                      fields={{ id: product.id, operation: "decrement" }}
                      label={<MinusIcon size={18} />}
                      variant="secondary"
                      className="!h-10 !w-10 !p-0 rounded-lg flex items-center justify-center hover:bg-danger/20 hover:text-danger hover:border-danger/50"
                    />
                    <QuickActionForm
                      action={quickUpdateStockAction}
                      fields={{ id: product.id, operation: "increment" }}
                      label={<PlusIcon size={18} />}
                      variant="secondary"
                      className="!h-10 !w-10 !p-0 rounded-lg flex items-center justify-center hover:bg-mint/20 hover:text-mint hover:border-mint/50"
                    />
                  </div>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm px-2">
                  <div>
                    <dt className="text-muted text-xs uppercase tracking-wider mb-0.5">Mínimo</dt>
                    <dd className="font-medium text-foreground">{product.low_stock_threshold}</dd>
                  </div>
                  <div>
                    <dt className="text-muted text-xs uppercase tracking-wider mb-0.5">Custo</dt>
                    <dd className="font-medium text-foreground">{currency(product.cost)}</dd>
                  </div>
                </dl>

                {product.notes ? (
                  <p className="mt-4 line-clamp-2 text-sm text-muted px-2 border-l-2 border-lilac/30">
                    {product.notes}
                  </p>
                ) : null}

                <div className="mt-6 flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-border-soft">
                  <Sheet
                    title={`Editar ${product.name}`}
                    trigger={<Button variant="secondary" size="sm">Editar Produto</Button>}
                  >
                    <ProductForm product={product} />
                  </Sheet>
                  
                  <QuickActionForm
                    action={deleteProductAction}
                    fields={{ id: product.id }}
                    label={<Trash2 size={16} />}
                    variant="danger"
                    confirmMessage={`Excluir ${product.name}?`}
                  />
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
      <div className="mt-8">
        <Pagination
          basePath="/produtos"
          page={productsPage.page}
          totalPages={productsPage.totalPages}
          total={productsPage.total}
          params={{ busca: params.busca, baixo: params.baixo }}
        />
      </div>
    </>
  );
}
